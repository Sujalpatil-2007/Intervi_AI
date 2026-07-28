const Interview = require("../models/interview.model");

const getDashboardSummary = async ({ userId }) => {
  const [
    totalInterviews,
    completedInterviews,
    pendingInterviews,
    inProgressInterviews,
    latestInterview,
    scoreStats,
  ] = await Promise.all([
    Interview.countDocuments({
      user: userId,
    }),

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

    Interview.findOne({
      user: userId,
      status: "completed",
    })
      .sort({ completedAt: -1 })
      .select("score"),

    Interview.aggregate([
      {
        $match: {
          user: userId,
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: "$score",
          },
          bestScore: {
            $max: "$score",
          },
        },
      },
    ]),
  ]);

  const averageScore =
    scoreStats.length > 0
      ? Number(scoreStats[0].averageScore.toFixed(2))
      : 0;

  const bestScore =
    scoreStats.length > 0
      ? scoreStats[0].bestScore
      : 0;

  return {
    totalInterviews,
    completedInterviews,
    pendingInterviews,
    inProgressInterviews,
    averageScore,
    bestScore,
    latestScore: latestInterview?.score || 0,
  };
};

const getRecentInterviews = async ({
  userId,
  limit = 5,
}) => {
  const interviews = await Interview.find({
    user: userId,
  })
    .select(
      "targetRole difficulty status score createdAt completedAt"
    )
    .sort({ createdAt: -1 })
    .limit(limit);

  return interviews;
};

module.exports = {
  getDashboardSummary,
  getRecentInterviews,
};