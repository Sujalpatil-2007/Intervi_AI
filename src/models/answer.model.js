const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "interview",
      required: true,
    },

    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "question",
      required: true,
    },

    answer: {
      type: String,
      default: "",
      trim: true,
    },

    timeTaken: {
      type: Number,
      default: 0,
    },

    aiScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    aiFeedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate answers for the same question in one interview
answerSchema.index(
  { interview: 1, question: 1 },
  { unique: true }
);

const answerModel = mongoose.model("Answer", answerSchema);
module.exports = answerModel;