const User = require("../models/user.model");
const Resume = require("../models/resume.model");
const Answer = require("../models/answer.model");
const Question = require("../models/question.model");
const Interview = require("../models/interview.model");
const InterviewEvaluation = require("../models/interviewEvaluation.model");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const AdminLog = require("../models/adminLog.model");
const { Parser } = require("json2csv");
const { createAdminLog } = require("../utils/adminLog");

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

const getAdminLogs = async (query) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    action,
    targetType,
    sort = "-createdAt",
  } = query;

  page = Number(page);
  limit = Number(limit);

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  if (limit > 100) limit = 100;

  const filter = {};

  if (search.trim()) {
    filter.description = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  if (action) {
    filter.action = action;
  }

  if (targetType) {
    filter.targetType = targetType;
  }

  const skip = (page - 1) * limit;

  const [logs, totalLogs] = await Promise.all([
    AdminLog.find(filter)
      .populate("admin", "fullName email")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),

    AdminLog.countDocuments(filter),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      hasNextPage: page * limit < totalLogs,
      hasPreviousPage: page > 1,
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

  const oldRole = user.role;

  user.role = role;

  await user.save();

  await createAdminLog({
    admin: currentAdmin._id,
    action: "UPDATE_USER_ROLE",
    targetType: "User",
    targetId: user._id,
    description: `Changed role from ${oldRole} to ${role}`,
    metadata: {
      oldRole,
      newRole: role,
    },
  });

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
      `User is already ${isBlocked ? "blocked" : "unblocked"}.`,
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

  if (user.isBlocked === isBlocked) {
    await createAdminLog({
      admin: currentAdmin._id,
      action: "BLOCK_USER",
      targetType: "User",
      targetId: user._id,
      description: `Blocked user ${user.email}`,
    });
  } else {
    await createAdminLog({
      admin: currentAdmin._id,
      action: "UNBLOCK_USER",
      targetType: "User",
      targetId: user._id,
      description: `UNBlocked user ${user.email}`,
    });
  }

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

  await createAdminLog({
    admin: currentAdmin._id,
    action: "DELETE_USER",
    targetType: "User",
    targetId: user._id,
    description: `Deleted user ${user.email}`,
  });

  await User.findByIdAndDelete(userId);

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
};

const getResumes = async (query) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    skill,
    targetRole,
    sort = "-createdAt",
  } = query;

  page = Number(page);
  limit = Number(limit);

  if (Number.isNaN(page) || page < 1) page = 1;
  if (Number.isNaN(limit) || limit < 1) limit = 10;
  if (limit > 100) limit = 100;

  const allowedSortFields = [
    "createdAt",
    "-createdAt",
    "updatedAt",
    "-updatedAt",
  ];

  if (!allowedSortFields.includes(sort)) {
    sort = "-createdAt";
  }

  const filter = {};

  if (skill) {
    filter.parsedSkills = {
      $regex: skill.trim(),
      $options: "i",
    };
  }

  if (targetRole) {
    filter.suggestedRoles = {
      $regex: targetRole.trim(),
      $options: "i",
    };
  }

  const skip = (page - 1) * limit;

  let resumes = await Resume.find(filter)
    .populate({
      path: "user",
      select: "fullName email",
      match: search
        ? {
            $or: [
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
            ],
          }
        : {},
    })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  // Remove resumes whose populated user didn't match search
  resumes = resumes.filter((resume) => resume.user);

  const totalResumes = await Resume.countDocuments(filter);

  return {
    resumes,
    pagination: {
      page,
      limit,
      totalResumes,
      totalPages: Math.ceil(totalResumes / limit),
      hasNextPage: page * limit < totalResumes,
      hasPreviousPage: page > 1,
    },
  };
};

const getResumeById = async (resumeId) => {
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    const error = new Error("Invalid resume ID.");
    error.statusCode = 400;
    throw error;
  }

  const resume = await Resume.findById(resumeId)
    .populate({
      path: "user",
      select:
        "fullName email avatar role targetRole experienceLevel isVerified isBlocked",
    })
    .lean();

  if (!resume) {
    const error = new Error("Resume not found.");
    error.statusCode = 404;
    throw error;
  }

  return resume;
};

const deleteResume = async (resumeId, currentAdmin) => {
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    const error = new Error("Invalid resume ID.");
    error.statusCode = 400;
    throw error;
  }

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    const error = new Error("Resume not found.");
    error.statusCode = 404;
    throw error;
  }

  // Delete PDF from Cloudinary
  if (resume.publicId) {
    await cloudinary.uploader.destroy(resume.publicId, {
      resource_type: "raw",
    });
  }

  await resume.deleteOne();

  await createAdminLog({
    admin: currentAdmin._id,
    action: "DELETE_RESUME",
    targetType: "Resume",
    targetId: resume._id,
    description: `Deleted resume ${resume.originalFileName}`,
  });

  return {
    _id: resume._id,
    title: resume.title,
    originalFileName: resume.originalFileName,
  };
};

const getInterviews = async (query) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    status,
    difficulty,
    sort = "-createdAt",
  } = query;

  page = Number(page);
  limit = Number(limit);

  if (Number.isNaN(page) || page < 1) {
    page = 1;
  }

  if (Number.isNaN(limit) || limit < 1) {
    limit = 10;
  }

  if (limit > 100) {
    limit = 100;
  }

  const filter = {};

  // Status filter
  if (status) {
    const allowedStatus = ["pending", "in_progress", "completed", "cancelled"];

    if (!allowedStatus.includes(status)) {
      const error = new Error("Invalid interview status.");
      error.statusCode = 400;
      throw error;
    }

    filter.status = status;
  }

  // Difficulty filter
  if (difficulty) {
    const allowedDifficulty = ["Easy", "Medium", "Hard"];

    if (!allowedDifficulty.includes(difficulty)) {
      const error = new Error("Invalid difficulty.");
      error.statusCode = 400;
      throw error;
    }

    filter.difficulty = difficulty;
  }

  // Sort validation
  const allowedSort = ["createdAt", "-createdAt", "score", "-score"];

  if (!allowedSort.includes(sort)) {
    sort = "-createdAt";
  }

  const skip = (page - 1) * limit;

  let interviews = await Interview.find(filter)
    .populate({
      path: "user",
      select: "fullName email",
      match: search.trim()
        ? {
            $or: [
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
            ],
          }
        : {},
    })
    .populate({
      path: "resume",
      select: "title originalFileName",
    })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  // Remove interviews where user didn't match search
  interviews = interviews.filter((item) => item.user);

  const totalInterviews = await Interview.countDocuments(filter);

  return {
    interviews,
    pagination: {
      page,
      limit,
      totalInterviews,
      totalPages: Math.ceil(totalInterviews / limit),
      hasNextPage: page * limit < totalInterviews,
      hasPreviousPage: page > 1,
    },
  };
};

const getInterviewById = async (interviewId) => {
  if (!mongoose.Types.ObjectId.isValid(interviewId)) {
    const error = new Error("Invalid interview ID.");
    error.statusCode = 400;
    throw error;
  }

  const interview = await Interview.findById(interviewId)
    .populate({
      path: "user",
      select:
        "fullName email avatar role targetRole experienceLevel isVerified",
    })
    .populate({
      path: "resume",
      select:
        "title originalFileName parsedSkills parsedProjects parsedExperience parsedEducation suggestedRoles",
    })
    .lean();

  if (!interview) {
    const error = new Error("Interview not found.");
    error.statusCode = 404;
    throw error;
  }

  const evaluation = await InterviewEvaluation.findOne({
    interview: interviewId,
  }).lean();

  return {
    interview,
    evaluation,
  };
};

const deleteInterview = async (interviewId, currentAdmin) => {
  if (!mongoose.Types.ObjectId.isValid(interviewId)) {
    const error = new Error("Invalid interview ID.");
    error.statusCode = 400;
    throw error;
  }

  const interview = await Interview.findById(interviewId);

  if (!interview) {
    const error = new Error("Interview not found.");
    error.statusCode = 404;
    throw error;
  }

  // Delete evaluation
  await InterviewEvaluation.deleteOne({
    interview: interviewId,
  });

  await Question.deleteMany({
    interview: interviewId,
  });

  await Answer.deleteMany({
    interview: interviewId,
  });

  await interview.deleteOne();

  const totalInterviews = await Interview.countDocuments(filter);

  return {
    interviews,
    pagination: {
      page,
      limit,
      totalInterviews,
      totalPages: Math.ceil(totalInterviews / limit),
      hasNextPage: page * limit < totalInterviews,
      hasPreviousPage: page > 1,
    },
  };
};

const exportUsers = async () => {
  const users = await User.find()
    .select(
      "fullName email role isVerified isBlocked targetRole experienceLevel createdAt",
    )
    .lean();

  const data = users.map((user) => ({
    "Full Name": user.fullName,
    Email: user.email,
    Role: user.role,
    Verified: user.isVerified ? "Yes" : "No",
    Blocked: user.isBlocked ? "Yes" : "No",
    "Target Role": user.targetRole || "-",
    "Experience Level": user.experienceLevel,
    "Created At": user.createdAt.toISOString(),
  }));

  const parser = new Parser();

  return parser.parse(data);
};

const exportResumes = async () => {
  const resumes = await Resume.find()
    .populate("user", "fullName email")
    .select(
      "user title originalFileName status parsedSkills suggestedRoles createdAt",
    )
    .lean();

  const data = resumes.map((resume) => ({
    "Resume ID": resume._id.toString(),
    "User Name": resume.user?.fullName || "-",
    "User Email": resume.user?.email || "-",
    Title: resume.title || "-",
    "Original File": resume.originalFileName || "-",
    Status: resume.status,
    Skills: resume.parsedSkills?.join(", ") || "-",
    "Suggested Roles": resume.suggestedRoles?.join(", ") || "-",
    "Created At": resume.createdAt.toISOString(),
  }));

  const parser = new Parser();

  return parser.parse(data);
};

const exportInterviews = async () => {
  const interviews = await Interview.find()
    .populate("user", "fullName email")
    .populate("resume", "title originalFileName")
    .select(
      `
      user
      resume
      targetRole
      difficulty
      duration
      totalQuestions
      status
      score
      startedAt
      completedAt
      createdAt
    `,
    )
    .lean();

  const data = interviews.map((interview) => ({
    "Interview ID": interview._id.toString(),

    "User Name": interview.user?.fullName || "-",

    "User Email": interview.user?.email || "-",

    "Resume Title":
      interview.resume?.title || interview.resume?.originalFileName || "-",

    "Target Role": interview.targetRole,

    Difficulty: interview.difficulty,

    Duration: `${interview.duration} min`,

    "Total Questions": interview.totalQuestions,

    Status: interview.status,

    Score: interview.score,

    "Started At": interview.startedAt ? interview.startedAt.toISOString() : "-",

    "Completed At": interview.completedAt
      ? interview.completedAt.toISOString()
      : "-",

    "Created At": interview.createdAt.toISOString(),
  }));

  const parser = new Parser();

  return parser.parse(data);
};

const exportAdminLogs = async () => {
  const logs = await AdminLog.find()
    .populate("admin", "fullName email")
    .sort({ createdAt: -1 })
    .lean();

  const data = logs.map((log) => ({
    "Log ID": log._id.toString(),

    "Admin Name": log.admin?.fullName || "-",

    "Admin Email": log.admin?.email || "-",

    Action: log.action,

    "Target Type": log.targetType,

    "Target ID": log.targetId.toString(),

    Description: log.description,

    Metadata:
      log.metadata && Object.keys(log.metadata).length > 0
        ? JSON.stringify(log.metadata)
        : "-",

    "Created At": log.createdAt.toISOString(),
  }));

  const parser = new Parser();

  return parser.parse(data);
};

module.exports = {
  getDashboard,
  getAdminLogs,
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
  exportUsers,
  exportResumes,
  exportInterviews,
  exportAdminLogs,
};
