const {
  getLeaderboard,
} = require("../service/leaderboard.service");

const getLeaderboardController = async (
  req,
  res,
  next
) => {
  try {
    const result = await getLeaderboard();

    res.json({
      success: true,
      message: "Leaderboard fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaderboardController,
};