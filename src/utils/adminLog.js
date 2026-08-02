const AdminLog = require("../models/adminLog.model");

const createAdminLog = async ({
  admin,
  action,
  targetType,
  targetId,
  description,
  metadata = {},
}) => {
  try {
    await AdminLog.create({
      admin,
      action,
      targetType,
      targetId,
      description,
      metadata,
    });
  } catch (error) {
    console.error("Admin Log Error:", error.message);
  }
};

module.exports = {
  createAdminLog,
};
