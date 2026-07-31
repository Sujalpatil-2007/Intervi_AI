const { getDashboard, getUsers } = require("../service/admin.service");

const getDashboardController = async (req, res, next) => {
  try {
    const result = await getDashboard();

    return res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUsersController = async (req, res, next) => {
  try {
    const data = await getUsers(req.query);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardController,
  getUsersController,
};
