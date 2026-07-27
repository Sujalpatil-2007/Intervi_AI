const {
  generateInterview,
  getInterviewById,
  getUserInterviews,
  startInterview,
  saveAnswer,
} = require("../service/interview.service");

async function generateInterviewController(req, res, next) {
  try {
    const result = await generateInterview({
      userId: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Interview generated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function getMyInterviewsController(req, res, next) {
  try {
    const result = await getUserInterviews({
      userId: req.user._id,
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 10),
      status: req.query.status,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

async function getInterviewController(req, res, next) {
  try {
    const result = await getInterviewById({
      interviewId: req.params.id,
      userId: req.user._id,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function startInterviewController(req, res, next) {
  try {
    const result = await startInterview({
      interviewId: req.params.id,
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Interview started successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function saveAnswerController(req, res, next) {
  try {
    const { questionId, answer, timeTaken } = req.body;

    const result = await saveAnswer({
      interviewId: req.params.id,
      userId: req.user._id,
      questionId,
      answer,
      timeTaken,
    });

    res.status(200).json({
      success: true,
      message: "Answer saved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMyInterviewsController,
  getInterviewController,
  generateInterviewController,
  startInterviewController,
  saveAnswerController,
};
