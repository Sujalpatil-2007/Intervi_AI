const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  getDashboardSummaryController,
  getRecentInterviewsController,
  getScoreTrendController,
  getSkillPerformanceController,
} = require("../controllers/dashboard.controller");

router.get("/summary", protect, getDashboardSummaryController);

router.get("/recent", protect, getRecentInterviewsController);

router.get("/score-trend", protect, getScoreTrendController);

router.get("/skills", protect, getSkillPerformanceController);

module.exports = router;
