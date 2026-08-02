const User = require("../models/user.model");
const Resume = require("../models/resume.model");
const Answer = require("../models/answer.model");
const Interview = require("../models/interview.model");
const InterviewEvaluation = require("../models/interviewEvaluation.model");
const mongoose = require("mongoose");

const getDashboard = async () => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const [
    totalUsers,
    totalResumes,
    totalInterviews,
    completedInterviews,
    totalEvaluations,
    averageScoreResult,
    activeUsers,
    recentUsers,
    recentResumes,
    recentInterviews,
  ] = await Promise.all([
    User.countDocuments(),

    Resume.countDocuments(),

    Interview.countDocuments(),

    Interview.countDocuments({
      status: "completed",
    }),

    InterviewEvaluation.countDocuments(),

    InterviewEvaluation.aggregate([
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: "$overallScore",
          },
        },
      },
    ]),

    User.countDocuments({
      createdAt: { $gte: last30Days },
    }),

    User.find()
      .select("fullName email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Resume.find()
      .populate("user", "fullName email")
      .select("user createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Interview.find()
      .populate("user", "fullName email")
      .select("user status score createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  return {
    overview: {
      totalUsers,
      totalResumes,
      totalInterviews,
      completedInterviews,
      totalEvaluations,
      activeUsers,
      averageScore:
        averageScoreResult.length > 0
          ? Number(averageScoreResult[0].averageScore.toFixed(2))
          : 0,
    },

    recentActivity: {
      users: recentUsers,
      resumes: recentResumes,
      interviews: recentInterviews,
    },
  };
};

const getUsers = async (query) => {
  let { page = 1, limit = 10, search = "", role, sort = "-createdAt" } = query;

  // Convert to numbers
  page = Number(page);
  limit = Number(limit);

  // Validation
  if (Number.isNaN(page) || page < 1) {
    page = 1;
  }

  if (Number.isNaN(limit) || limit < 1) {
    limit = 10;
  }

  // Prevent huge queries
  if (limit > 100) {
    limit = 100;
  }

  // Allowed sort fields
  const allowedSortFields = [
    "createdAt",
    "-createdAt",
    "fullName",
    "-fullName",
    "email",
    "-email",
    "role",
    "-role",
  ];

  if (!allowedSortFields.includes(sort)) {
    sort = "-createdAt";
  }

  const filter = {};

  // Search
  if (search && search.trim()) {
    filter.$or = [
      {
        fullName: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        email: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  // Role validation
  if (role) {
    const allowedRoles = ["user", "admin"];

    if (!allowedRoles.includes(role)) {
      const error = new Error("Invalid role filter.");
      error.statusCode = 400;
      throw error;
    }

    filter.role = role;
  }

  const skip = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    User.find(filter)
      .select("-password -refreshToken -__v")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),

    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      hasNextPage: page * limit < totalUsers,
      hasPreviousPage: page > 1,
    },
  };
};

const getUserById = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user ID.");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId)
    .select("-password -refreshToken -__v")
    .lean();

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  const [
    resumeCount,
    interviewCount,
    completedInterviews,
    pendingInterviews,
    inProgressInterviews,
    evaluationCount,
    averageScoreResult,
  ] = await Promise.all([
    Resume.countDocuments({ user: userId }),

    Interview.countDocuments({ user: userId }),

    Interview.countDocuments({
      user: userId,
      status: "completed",
    }),

    Interview.countDocuments({
      user: userId,
      status: "pending",
    }),

    Interview.countDocuments({
      user: userId,
      status: "in_progress",
    }),

    InterviewEvaluation.countDocuments({
      user: userId,
    }),

    InterviewEvaluation.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: "$overallScore",
          },
        },
      },
    ]),
  ]);

  return {
    user,

    stats: {
      resumeCount,
      interviewCount,
      completedInterviews,
      pendingInterviews,
      inProgressInterviews,
      evaluationCount,
      averageScore:
        averageScoreResult.length > 0
          ? Number(averageScoreResult[0].averageScore.toFixed(2))
          : 0,
    },
  };
};

const updateUserRole = async (userId, body, currentAdmin) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user ID.");
    error.statusCode = 400;
    throw error;
  }

  const role = body?.role;

  if (!role) {
    const error = new Error("Role is required.");
    error.statusCode = 400;
    throw error;
  }

  const allowedRoles = ["user", "admin"];

  if (!allowedRoles.includes(role)) {
    const error = new Error("Invalid role.");
    error.statusCode = 400;
    throw error;
  }

  // Prevent admin from changing their own role
  if (currentAdmin._id.toString() === userId) {
    const error = new Error("You cannot change your own role.");
    error.statusCode = 403;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  if (user.role === role) {
    const error = new Error(`User is already ${role}.`);
    error.statusCode = 400;
    throw error;
  }

  user.role = role;

  await user.save();

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    updatedAt: user.updatedAt,
  };
};

const updateUserBlockStatus = async (userId, body = {}, currentAdmin) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user ID.");
    error.statusCode = 400;
    throw error;
  }

  const { isBlocked } = body;

  if (typeof isBlocked !== "boolean") {
    const error = new Error("isBlocked must be a boolean.");
    error.statusCode = 400;
    throw error;
  }

  // Prevent admin from blocking themselves
  if (currentAdmin._id.toString() === userId) {
    const error = new Error("You cannot block your own account.");
    error.statusCode = 403;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  if (user.isBlocked === isBlocked) {
    const error = new Error(
      `User is already ${isBlocked ? "blocked" : "unblocked"}.`
    );
    error.statusCode = 400;
    throw error;
  }

  // Prevent blocking the last admin
  if (user.role === "admin" && isBlocked) {
    const adminCount = await User.countDocuments({
      role: "admin",
      isBlocked: false,
    });

    if (adminCount <= 1) {
      const error = new Error("Cannot block the last active admin.");
      error.statusCode = 400;
      throw error;
    }
  }

  user.isBlocked = isBlocked;

  await user.save();

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked,
    updatedAt: user.updatedAt,
  };
};

const deleteUser = async (userId, currentAdmin) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid user ID.");
    error.statusCode = 400;
    throw error;
  }

  if (currentAdmin._id.toString() === userId) {
    const error = new Error("You cannot delete your own account.");
    error.statusCode = 403;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  // Prevent deleting the last active admin
  if (user.role === "admin") {
    const activeAdmins = await User.countDocuments({
      role: "admin",
      isBlocked: false,
    });

    if (activeAdmins <= 1) {
      const error = new Error("Cannot delete the last active admin.");
      error.statusCode = 400;
      throw error;
    }
  }

  // Delete related data
  await Promise.all([
    Resume.deleteMany({ user: userId }),
    Interview.deleteMany({ user: userId }),
    InterviewEvaluation.deleteMany({ user: userId }),

    // Only if Answer model exists
    Answer.deleteMany({ user: userId }),
  ]);

  await User.findByIdAndDelete(userId);

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
};

module.exports = {
  getDashboard,
  getUsers,
  getUserById,
  updateUserRole,
  updateUserBlockStatus,
  deleteUser,
};
