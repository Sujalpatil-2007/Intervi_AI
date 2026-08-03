const express = require("express");

const protect = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const {
  uploadResumeController,
  getMyResumeController,
  deleteResumeController,
} = require("../controllers/resume.controller");

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResumeController,
);

router.get("/me", protect, getMyResumeController);
router.delete("/delete", protect, deleteResumeController);

module.exports = router;
