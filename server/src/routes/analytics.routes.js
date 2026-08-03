const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const {
  getUserAnalyticsController,
  getInterviewAnalyticsController,
  getResumeAnalyticsController,
  getPerformanceAnalyticsController,
} = require("../controllers/analytics.controller");

router.get("/analytics/users", protect, admin, getUserAnalyticsController);
router.get("/analytics/interviews",protect,admin,getInterviewAnalyticsController);
router.get("/analytics/resumes",protect,admin,getResumeAnalyticsController);
router.get("/analytics/performance",protect,admin,getPerformanceAnalyticsController);

module.exports = router;
