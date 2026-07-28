const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  getDashboardSummaryController,
} = require("../controllers/dashboard.controller");

router.get("/summary", protect, getDashboardSummaryController);

module.exports = router;
