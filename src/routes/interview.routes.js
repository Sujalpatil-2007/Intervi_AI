const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  generateInterviewController,
  getInterviewController,
  getMyInterviewsController,
  startInterviewController,
} = require("../controllers/interview.controller");

router.post("/generate", protect, generateInterviewController);

router.get("/:id", protect, getInterviewController);

router.get("/", protect, getMyInterviewsController);

router.post("/:id/start", protect, startInterviewController);

module.exports = router;
