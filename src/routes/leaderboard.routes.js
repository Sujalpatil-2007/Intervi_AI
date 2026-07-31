const express = require("express");

const router = express.Router();

const {
  getLeaderboardController,
} = require("../controllers/leaderboard.controller");

router.get("/", getLeaderboardController);

module.exports = router;
