const {
  getDashboardSummary,
} = require("../service/dashboard.service");

const getDashboardSummaryController = async (
  req,
  res,
  next
) => {
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

module.exports = {
  getDashboardSummaryController,
};