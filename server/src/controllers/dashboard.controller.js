const {
  getDashboardSummary,
  getRecentInterviews,
  getScoreTrend,
  getSkillPerformance,
} = require("../service/dashboard.service");

const getDashboardSummaryController = async (req, res, next) => {
  try {
    const result = await getDashboardSummary({
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getRecentInterviewsController = async (req, res, next) => {
  try {
    const result = await getRecentInterviews({
      userId: req.user._id,
      limit: Number(req.query.limit || 5),
    });

    res.status(200).json({
      success: true,
      message: "Recent interviews fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getScoreTrendController = async (req, res, next) => {
  try {
    const result = await getScoreTrend({
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Score trend fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSkillPerformanceController = async (req, res, next) => {
  try {
    const result = await getSkillPerformance({
      userId: req.user._id,
    });

    res.json({
      success: true,
      message: "Skill performance fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummaryController,
  getRecentInterviewsController,
  getScoreTrendController,
  getSkillPerformanceController,
};
