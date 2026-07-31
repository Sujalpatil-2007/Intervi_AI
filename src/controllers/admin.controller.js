const { getDashboard } = require("../service/admin.service");

const getDashboardController = async (req, res, next) => {
  try {
    const result = await getDashboard();

    res.json({
      success: true,
      message: "Dashboard fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardController,
};
