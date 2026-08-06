const Interview = require("../models/interview.model");
const InterviewEvaluation = require("../models/interviewEvaluation.model");

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
    scoreStats.length > 0 ? Number(scoreStats[0].averageScore.toFixed(2)) : 0;

  const bestScore = scoreStats.length > 0 ? scoreStats[0].bestScore : 0;

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

const getRecentInterviews = async ({ userId, limit = 5 }) => {
  const interviews = await Interview.find({
    user: userId,
  })
    .select("targetRole difficulty status score createdAt completedAt")
    .sort({ createdAt: -1 })
    .limit(limit);

  return interviews;
};

const getScoreTrend = async ({ userId }) => {
  const interviews = await Interview.find({
    user: userId,
    status: "completed",
  })
    .select("score completedAt createdAt targetRole")
    .sort({ completedAt: 1, createdAt: 1 });

  return interviews.map((interview, index) => ({
    interview: index + 1,
    targetRole: interview.targetRole,
    score: interview.score,
    date: interview.completedAt || interview.createdAt,
  }));
};

const getSkillPerformance = async ({ userId }) => {
  const evaluations = await InterviewEvaluation.find({ user: userId });

  const skillMap = {};

  evaluations.forEach((evaluation) => {
    if (!evaluation.interview) return;

    evaluation.questionEvaluations.forEach((item) => {
      const category = item.category || "General";

      if (!skillMap[category]) {
        skillMap[category] = {
          total: 0,
          count: 0,
        };
      }

      skillMap[category].total += item.score;

      skillMap[category].count++;
    });
  });

  const result = Object.entries(skillMap).map(([category, value]) => ({
    category,
    averageScore: Number((value.total / value.count).toFixed(2)),
  }));

  result.sort((a, b) => b.averageScore - a.averageScore);

  return result;
};

module.exports = {
  getDashboardSummary,
  getRecentInterviews,
  getScoreTrend,
  getSkillPerformance,
};
