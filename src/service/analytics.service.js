const User = require("../models/user.model");
const Resume = require("../models/resume.model");
const Answer = require("../models/answer.model");
const Question = require("../models/question.model");
const Interview = require("../models/interview.model");
const InterviewEvaluation = require("../models/interviewEvaluation.model");

const getUserAnalytics = async () => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 29);

  const [
    totalUsers,
    totalAdmins,
    verifiedUsers,
    unverifiedUsers,
    registrations,
  ] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({
      role: "admin",
    }),

    User.countDocuments({
      isVerified: true,
    }),

    User.countDocuments({
      isVerified: false,
    }),

    User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: last30Days,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]),
  ]);

  return {
    summary: {
      totalUsers,
      totalAdmins,
      verifiedUsers,
      unverifiedUsers,
    },

    registrationTrend: registrations.map((item) => ({
      date: item._id,
      count: item.count,
    })),
  };
};

const getInterviewAnalytics = async () => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 29);

  const [
    totalInterviews,
    averageScoreResult,
    creationTrend,
    statusDistribution,
    difficultyDistribution,
    targetRoleDistribution,
  ] = await Promise.all([
    Interview.countDocuments(),

    Interview.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: "$score",
          },
        },
      },
    ]),

    Interview.aggregate([
      {
        $match: {
          createdAt: {
            $gte: last30Days,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]),

    Interview.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]),

    Interview.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: {
            $sum: 1,
          },
        },
      },
    ]),

    Interview.aggregate([
      {
        $group: {
          _id: "$targetRole",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 10,
      },
    ]),
  ]);

  return {
    summary: {
      totalInterviews,
      averageScore:
        averageScoreResult.length > 0
          ? Number(averageScoreResult[0].averageScore.toFixed(2))
          : 0,
    },

    creationTrend: creationTrend.map((item) => ({
      date: item._id,
      count: item.count,
    })),

    statusDistribution: statusDistribution.map((item) => ({
      status: item._id,
      count: item.count,
    })),

    difficultyDistribution: difficultyDistribution.map((item) => ({
      difficulty: item._id,
      count: item.count,
    })),

    targetRoleDistribution: targetRoleDistribution.map((item) => ({
      role: item._id,
      count: item.count,
    })),
  };
};

const getResumeAnalytics = async () => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 29);

  const [
    totalResumes,
    uploadTrend,
    statusDistribution,
    topRoles,
    topSkills,
  ] = await Promise.all([
    Resume.countDocuments(),

    Resume.aggregate([
      {
        $match: {
          createdAt: {
            $gte: last30Days,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]),

    Resume.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]),

    Resume.aggregate([
      {
        $unwind: "$suggestedRoles",
      },
      {
        $group: {
          _id: "$suggestedRoles",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 10,
      },
    ]),

    Resume.aggregate([
      {
        $unwind: "$parsedSkills",
      },
      {
        $group: {
          _id: "$parsedSkills",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 15,
      },
    ]),
  ]);

  return {
    summary: {
      totalResumes,
    },

    uploadTrend: uploadTrend.map((item) => ({
      date: item._id,
      count: item.count,
    })),

    statusDistribution: statusDistribution.map((item) => ({
      status: item._id,
      count: item.count,
    })),

    topSuggestedRoles: topRoles.map((item) => ({
      role: item._id,
      count: item.count,
    })),

    topSkills: topSkills.map((item) => ({
      skill: item._id,
      count: item.count,
    })),
  };
};

const getPerformanceAnalytics = async () => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 29);

  const [
    averageScoreResult,
    scoreTrend,
    strengths,
    weaknesses,
    scoreDistribution,
  ] = await Promise.all([
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

    InterviewEvaluation.aggregate([
      {
        $match: {
          createdAt: {
            $gte: last30Days,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          averageScore: {
            $avg: "$overallScore",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]),

    InterviewEvaluation.aggregate([
      {
        $unwind: "$strengths",
      },
      {
        $group: {
          _id: "$strengths",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 10,
      },
    ]),

    InterviewEvaluation.aggregate([
      {
        $unwind: "$weaknesses",
      },
      {
        $group: {
          _id: "$weaknesses",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 10,
      },
    ]),

    InterviewEvaluation.aggregate([
      {
        $bucket: {
          groupBy: "$overallScore",
          boundaries: [0, 20, 40, 60, 80, 101],
          default: "Other",
          output: {
            count: {
              $sum: 1,
            },
          },
        },
      },
    ]),
  ]);

  return {
    summary: {
      averageScore:
        averageScoreResult.length > 0
          ? Number(averageScoreResult[0].averageScore.toFixed(2))
          : 0,
    },

    scoreTrend: scoreTrend.map((item) => ({
      date: item._id,
      averageScore: Number(item.averageScore.toFixed(2)),
    })),

    scoreDistribution: scoreDistribution.map((item) => ({
      range: item._id,
      count: item.count,
    })),

    topStrengths: strengths.map((item) => ({
      strength: item._id,
      count: item.count,
    })),

    topWeaknesses: weaknesses.map((item) => ({
      weakness: item._id,
      count: item.count,
    })),
  };
};

module.exports = {
  getUserAnalytics,
  getInterviewAnalytics,
  getResumeAnalytics,
  getPerformanceAnalytics,
};
