const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  generateInterviewController,
  getInterviewController,
  getMyInterviewsController,
  startInterviewController,
  saveAnswerController,
} = require("../controllers/interview.controller");

router.post("/generate", protect, generateInterviewController);

router.get("/", protect, getMyInterviewsController);

router.post("/:id/start", protect, startInterviewController);

router.post("/:id/answer", protect, saveAnswerController);

router.get("/:id", protect, getInterviewController);

module.exports = router;
