const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  getDashboardSummaryController,
  getRecentInterviewsController,
  getScoreTrendController,
} = require("../controllers/dashboard.controller");

router.get("/summary", protect, getDashboardSummaryController);

router.get("/recent", protect, getRecentInterviewsController);

router.get("/score-trend", protect, getScoreTrendController);

module.exports = router;
