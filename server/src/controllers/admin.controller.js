const {
  getDashboard,
  getUsers,
  getUserById,
  updateUserRole,
  updateUserBlockStatus,
  deleteUser,
  getResumes,
  getResumeById,
  deleteResume,
  getInterviews,
  getInterviewById,
  deleteInterview,
  getAdminLogs,
  exportUsers,
  exportResumes,
  exportInterviews,
  exportAdminLogs,
} = require("../service/admin.service");

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

const getAdminLogsController = async (req, res, next) => {
  try {
    const data = await getAdminLogs(req.query);

    return res.status(200).json({
      success: true,
      message: "Admin logs fetched successfully.",
      data,
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
    const data = await updateUserRole(req.params.id, req.body, req.user);

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
    const data = await updateUserBlockStatus(req.params.id, req.body, req.user);

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
    const data = await deleteUser(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getResumesController = async (req, res, next) => {
  try {
    const data = await getResumes(req.query);

    res.status(200).json({
      success: true,
      message: "Resumes fetched successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getResumeByIdController = async (req, res, next) => {
  try {
    const data = await getResumeById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Resume fetched successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteResumeController = async (req, res, next) => {
  try {
    const data = await deleteResume(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getInterviewsController = async (req, res, next) => {
  try {
    const data = await getInterviews(req.query);

    return res.status(200).json({
      success: true,
      message: "Interviews fetched successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getInterviewByIdController = async (req, res, next) => {
  try {
    const data = await getInterviewById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Interview fetched successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteInterviewController = async (req, res, next) => {
  try {
    const data = await deleteInterview(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Interview deleted successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const exportUsersController = async (req, res, next) => {
  try {
    const csv = await exportUsers();

    res.header("Content-Type", "text/csv");

    res.attachment("users.csv");

    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

const exportResumesController = async (req, res, next) => {
  try {
    const csv = await exportResumes();

    res.header("Content-Type", "text/csv");
    res.attachment("resumes.csv");

    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

const exportInterviewsController = async (req, res, next) => {
  try {
    const csv = await exportInterviews();

    res.header("Content-Type", "text/csv");
    res.attachment("interviews.csv");

    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

const exportAdminLogsController = async (req, res, next) => {
  try {
    const csv = await exportAdminLogs();

    res.header("Content-Type", "text/csv");
    res.attachment("admin-logs.csv");

    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardController,
  getAdminLogsController,
  getUsersController,
  getUserByIdController,
  updateUserRoleController,
  updateUserBlockStatusController,
  deleteUserController,
  getResumesController,
  getResumeByIdController,
  deleteResumeController,
  getInterviewsController,
  getInterviewByIdController,
  deleteInterviewController,
  exportUsersController,
  exportResumesController,
  exportInterviewsController,
  exportAdminLogsController,
};
