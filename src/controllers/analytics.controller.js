const { getUserAnalytics, getInterviewAnalytics, getResumeAnalytics, getPerformanceAnalytics } = require("../service/analytics.service");

const getUserAnalyticsController = async (req, res, next) => {
  try {
    const data = await getUserAnalytics();

    return res.status(200).json({
      success: true,
      message: "User analytics fetched successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getInterviewAnalyticsController = async (req, res, next) => {
  try {
    const data = await getInterviewAnalytics();

    return res.status(200).json({
      success: true,
      message: "Interview analytics fetched successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getResumeAnalyticsController = async (req, res, next) => {
  try {
    const data = await getResumeAnalytics();

    return res.status(200).json({
      success: true,
      message: "Resume analytics fetched successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getPerformanceAnalyticsController = async (req, res, next) => {
  try {
    const data = await getPerformanceAnalytics();

    return res.status(200).json({
      success: true,
      message: "Performance analytics fetched successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    getUserAnalyticsController,
    getInterviewAnalyticsController,
    getResumeAnalyticsController,
    getPerformanceAnalyticsController,
}