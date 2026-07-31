const User = require("../models/user.model");
const Resume = require("../models/resume.model");
const Interview = require("../models/interview.model");

const getDashboard = async () => {
  const [
    totalUsers,
    totalResumes,
    totalInterviews,
    completedInterviews,
    averageScore,
  ] = await Promise.all([
    User.countDocuments(),

    Resume.countDocuments(),

    Interview.countDocuments(),

    Interview.countDocuments({
      status: "completed",
    }),

    Interview.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          average: {
            $avg: "$score",
          },
        },
      },
    ]),
  ]);

  return {
    totalUsers,
    totalResumes,
    totalInterviews,
    completedInterviews,
    averageScore:
      averageScore.length > 0
        ? Number(averageScore[0].average.toFixed(2))
        : 0,
  };
};

module.exports = {
  getDashboard,
};