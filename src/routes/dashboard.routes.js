const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  getDashboardSummaryController,
  getRecentInterviewsController,
} = require("../controllers/dashboard.controller");

router.get("/summary", protect, getDashboardSummaryController);

router.get(
  "/recent",
  protect,
  getRecentInterviewsController
);

module.exports = router;
