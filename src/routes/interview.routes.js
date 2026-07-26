const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  generateInterviewController,
  getInterviewController,
  getMyInterviewsController,
} = require("../controllers/interview.controller");

router.post("/generate", protect, generateInterviewController);

router.get("/:id", protect, getInterviewController);

router.get("/", protect, getMyInterviewsController);

module.exports = router;
