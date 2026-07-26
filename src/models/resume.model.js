const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    title: String,

    originalFileName: String,

    fileUrl: String,

    publicId: String,

    fileSize: Number,

    mimeType: String,

    extractedText: String,

    parsedSkills: [String],

    parsedProjects: [
      {
        name: String,
        description: String,
        technologies: [String],
      },
    ],

    parsedExperience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],

    parsedEducation: [
      {
        institution: String,
        degree: String,
        status: String,
        expectedGraduation: String,
      },
    ],

    suggestedRoles: [String],

    // ⭐ Add this
    aiAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    status: {
      type: String,
      enum: ["uploaded", "processing", "completed"],
      default: "uploaded",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
