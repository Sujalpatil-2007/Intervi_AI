const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resume",
      required: true,
    },

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    duration: {
      type: Number,
      default: 20,
    },

    totalQuestions: {
      type: Number,
      default: 10,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },

    score: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const interviewModel = mongoose.model("interview", interviewSchema);
module.exports = interviewModel;