const Interview = require("../models/interview.model");

const getLeaderboard = async () => {
  const leaderboard = await Interview.aggregate([
    {
      $match: {
        status: "completed",
      },
    },

    {
      $group: {
        _id: "$user",

        averageScore: {
          $avg: "$score",
        },

        bestScore: {
          $max: "$score",
        },

        completedInterviews: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        averageScore: -1,
        bestScore: -1,
      },
    },

    {
      $lookup: {
        from: "users", // MongoDB collection name
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: "$user",
    },

    {
      $project: {
        _id: 0,

        userId: "$user._id",

        name: "$user.fullName",

        email: "$user.email",

        averageScore: {
          $round: ["$averageScore", 2],
        },

        bestScore: 1,

        completedInterviews: 1,
      },
    },

    {
      $limit: 10,
    },
  ]);

  return leaderboard.map((item, index) => ({
    rank: index + 1,
    ...item,
  }));
};

module.exports = {
  getLeaderboard,
};
