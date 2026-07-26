const Interview = require("../models/interview.model");
const Question = require("../models/question.model");
const Resume = require("../models/resume.model");

const { buildInterviewPrompt } = require("../utils/promptBuilder");

const {
  generateInterviewQuestions,
} = require("./geminiInterview.service");

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
      "Resume analysis is incomplete. Please upload a valid resume."
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
    status: "generated",
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
const getInterviewById = async ({
  interviewId,
  userId,
}) => {
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
const getUserInterviews = async ({
  userId,
  page = 1,
  limit = 10,
  status,
}) => {
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

module.exports = {
  generateInterview,
  getInterviewById,
  getUserInterviews,
};