const User = require("../models/user.model");
const Resume = require("../models/resume.model");
const Interview = require("../models/interview.model");
const InterviewEvaluation = require("../models/interviewEvaluation.model");

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
    }}
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
  let {
    page = 1,
    limit = 10,
    search = "",
    role,
    sort = "-createdAt",
  } = query;

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

module.exports = {
  getDashboard,
  getUsers,
};