const Interview = require("../models/interview.model");
const Question = require("../models/question.model");
const Resume = require("../models/resume.model");
const Answer = require("../models/answer.model");

const { buildEvaluationPrompt } = require("../utils/evaluationPromptBuilder");

const {
  evaluateInterview: evaluateWithGemini,
} = require("./geminiEvaluation.service");

const { buildInterviewPrompt } = require("../utils/promptBuilder");

const { generateInterviewQuestions } = require("./geminiInterview.service");
const InterviewEvaluation = require("../models/interviewEvaluation.model");

// Generate Interview
const generateInterview = async ({
  userId,
  targetRole,
  difficulty,
  duration,
  questionCount,
}) => {
  // Find latest uploaded resume
  const resume = await Resume.findOne({
    user: userId,
  }).sort({ createdAt: -1 });

  if (!resume) {
    const error = new Error("Resume not found.");
    error.statusCode = 404;
    throw error;
  }

  // Validate AI analysis
  if (
    !resume.parsedSkills?.length &&
    !resume.parsedProjects?.length &&
    !resume.parsedExperience?.length
  ) {
    const error = new Error(
      "Resume analysis is incomplete. Please upload a valid resume.",
    );

    error.statusCode = 400;
    throw error;
  }

  // Build Gemini Prompt
  const prompt = buildInterviewPrompt({
    resume,
    targetRole,
    difficulty,
    questionCount,
  });

  // Generate AI Questions
  const questions = await generateInterviewQuestions(prompt);

  if (!questions || !questions.length) {
    const error = new Error("Failed to generate interview questions.");
    error.statusCode = 500;
    throw error;
  }

  // Create Interview
  const interview = await Interview.create({
    user: userId,
    resume: resume._id,
    targetRole,
    difficulty,
    duration,
    totalQuestions: questions.length,
    status: "pending",
  });

  // Create Question Documents
  const questionDocs = questions.map((item, index) => ({
    interview: interview._id,
    question: item.question,
    type: item.type,
    difficulty: item.difficulty,
    expectedAnswer: item.expectedAnswer,
    keywords: item.keywords || [],
    order: index + 1,
  }));

  // Save Questions
  await Question.insertMany(questionDocs);

  return {
    interviewId: interview._id,
    status: interview.status,
    totalQuestions: interview.totalQuestions,
  };
};

// Get Interview By ID
const getInterviewById = async ({ interviewId, userId }) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  }).populate("resume");

  if (!interview) {
    const error = new Error("Interview not found.");
    error.statusCode = 404;
    throw error;
  }

  const questions = await Question.find({
    interview: interview._id,
  }).sort({ order: 1 });

  return {
    interview,
    questions,
  };
};

// Get User Interviews
const getUserInterviews = async ({ userId, page = 1, limit = 10, status }) => {
  const query = {
    user: userId,
  };

  if (status) {
    query.status = status;
  }

  const total = await Interview.countDocuments(query);

  const interviews = await Interview.find(query)
    .populate("resume", "suggestedRoles parsedSkills")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: interviews,
  };
};

//start the interview
const startInterview = async ({ interviewId, userId }) => {
  // Find interview belonging to current user
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    const error = new Error("Interview not found.");
    error.statusCode = 404;
    throw error;
  }

  // Interview can only be started once
  if (interview.status !== "pending") {
    const error = new Error(
      `Interview cannot be started. Current status is '${interview.status}'.`,
    );
    error.statusCode = 400;
    throw error;
  }

  // Update interview status
  interview.status = "in_progress";
  interview.startedAt = new Date();

  await interview.save();

  // Fetch interview questions
  const questions = await Question.find({
    interview: interview._id,
  }).sort({ order: 1 });

  return {
    interview,
    questions,
  };
};

//save answers
const saveAnswer = async ({
  interviewId,
  userId,
  questionId,
  answer,
  timeTaken,
}) => {
  // Check interview ownership
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    const error = new Error("Interview not found.");
    error.statusCode = 404;
    throw error;
  }

  // Interview must be in progress
  if (interview.status !== "in_progress") {
    const error = new Error("Interview is not currently in progress.");
    error.statusCode = 400;
    throw error;
  }

  // Verify the question belongs to this interview
  const question = await Question.findOne({
    _id: questionId,
    interview: interviewId,
  });

  if (!question) {
    const error = new Error("Question not found.");
    error.statusCode = 404;
    throw error;
  }

  // Create or update answer
  const savedAnswer = await Answer.findOneAndUpdate(
    {
      interview: interviewId,
      question: questionId,
    },
    {
      answer,
      timeTaken,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  return {
    answerId: savedAnswer._id,
    questionId,
    saved: true,
  };
};

//finish the interview
const finishInterview = async ({ interviewId, userId }) => {
  // Find interview
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    const error = new Error("Interview not found.");
    error.statusCode = 404;
    throw error;
  }

  // Interview must be in progress
  if (interview.status !== "in_progress") {
    const error = new Error("Only interviews in progress can be completed.");
    error.statusCode = 400;
    throw error;
  }

  // Count questions
  const totalQuestions = await Question.countDocuments({
    interview: interviewId,
  });

  // Count answers
  const answeredQuestions = await Answer.countDocuments({
    interview: interviewId,
  });

  // Mark interview completed
  interview.status = "completed";
  interview.completedAt = new Date();

  await interview.save();

  return {
    interviewId: interview._id,
    status: interview.status,
    totalQuestions,
    answeredQuestions,
  };
};

//Overall data of interview
const evaluateInterview = async ({
  interviewId,
  userId,
}) => {
  // Find interview
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    const error = new Error("Interview not found.");
    error.statusCode = 404;
    throw error;
  }

  // Interview must be completed
  if (interview.status !== "completed") {
    const error = new Error(
      "Complete the interview before evaluation."
    );
    error.statusCode = 400;
    throw error;
  }

  // Load questions
  const questions = await Question.find({
    interview: interviewId,
  }).sort({ order: 1 });

  // Load answers
  const answers = await Answer.find({
    interview: interviewId,
  });

  if (!answers.length) {
    const error = new Error("No answers found.");
    error.statusCode = 400;
    throw error;
  }

  // Build Gemini prompt
  const prompt = buildEvaluationPrompt({
    interview,
    questions,
    answers,
  });

  // Evaluate with Gemini
  const evaluation = await evaluateWithGemini(prompt);

  // Check if evaluation already exists
  let interviewEvaluation = await InterviewEvaluation.findOne({
    interview: interview._id,
  });

  if (!interviewEvaluation) {
    interviewEvaluation = await InterviewEvaluation.create({
      interview: interview._id,
      overallScore: evaluation.overallScore,
      overallFeedback: evaluation.overallFeedback,
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
      questionEvaluations:
        evaluation.questionEvaluations || [],
    });
  } else {
    interviewEvaluation.overallScore =
      evaluation.overallScore;

    interviewEvaluation.overallFeedback =
      evaluation.overallFeedback;

    interviewEvaluation.strengths =
      evaluation.strengths || [];

    interviewEvaluation.weaknesses =
      evaluation.weaknesses || [];

    interviewEvaluation.questionEvaluations =
      evaluation.questionEvaluations || [];

    await interviewEvaluation.save();
  }

  // Update interview summary
  interview.score = evaluation.overallScore;
  interview.feedback = evaluation.overallFeedback;

  await interview.save();

  return {
    interview,
    evaluation: interviewEvaluation,
  };
};

// Get Interview Evaluation
const getInterviewEvaluation = async ({
  interviewId,
  userId,
}) => {
  // Verify interview belongs to current user
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    const error = new Error("Interview not found.");
    error.statusCode = 404;
    throw error;
  }

  // Find evaluation
  const evaluation = await InterviewEvaluation.findOne({
    interview: interview._id,
  });

  if (!evaluation) {
    const error = new Error("Interview evaluation not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    interview,
    evaluation,
  };
};

module.exports = {
  generateInterview,
  getInterviewById,
  getUserInterviews,
  startInterview,
  saveAnswer,
  finishInterview,
  evaluateInterview,
  getInterviewEvaluation,
};
