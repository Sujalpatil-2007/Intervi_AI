const { getDashboard, getUsers, getUserById, updateUserRole, updateUserBlockStatus, deleteUser} = require("../service/admin.service");

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

const getUserByIdController = async (req, res, next) => {
  try {
    const data = await getUserById(req.params.id);

    res.status(200).json({
      success: true,
      message: "User fetched successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRoleController = async (req, res, next) => {
   try {
    const data = await updateUserRole(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserBlockStatusController = async (req, res, next) => {
  try {
    const data = await updateUserBlockStatus(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: `User ${data.isBlocked ? "blocked" : "unblocked"} successfully.`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserController = async (req, res, next) => {
  try {
    const data = await deleteUser(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getDashboardController,
  getUsersController,
  getUserByIdController,
  updateUserRoleController,
  updateUserBlockStatusController,
  deleteUserController,
};
