const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "interview",
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["Technical", "Behavioral", "Project", "HR"],
      default: "Technical",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    expectedAnswer: {
      type: String,
      default: "",
    },

    keywords: [
      {
        type: String,
      },
    ],

    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const questionModel = mongoose.model("question", questionSchema);
module.exports = questionModel;