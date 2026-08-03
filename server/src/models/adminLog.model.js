const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    targetType: {
      type: String,
      enum: ["User", "Resume", "Interview"],
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

adminLogSchema.index({ targetType: 1 });
adminLogSchema.index({ createdAt: -1 });
adminLogSchema.index({ admin: 1 });
adminLogSchema.index({ action: 1 });

module.exports = mongoose.model("AdminLog", adminLogSchema);
