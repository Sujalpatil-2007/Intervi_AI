const mongoose = require("mongoose");

const questionEvaluationSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "General",
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    feedback: {
      type: String,
      default: "",
      trim: true,
    },

    improvement: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const interviewEvaluationSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "interview",
      required: true,
      unique: true,
    },

    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    overallFeedback: {
      type: String,
      default: "",
      trim: true,
    },

    strengths: [
      {
        type: String,
        trim: true,
      },
    ],

    weaknesses: [
      {
        type: String,
        trim: true,
      },
    ],

    questionEvaluations: [questionEvaluationSchema],
  },
  {
    timestamps: true,
  },
);

const InterviewEvaluation = mongoose.model(
  "InterviewEvaluation",
  interviewEvaluationSchema,
);

module.exports = InterviewEvaluation;
