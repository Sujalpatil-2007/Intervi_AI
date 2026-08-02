const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const {
  getDashboardController,
  getUsersController,
  getUserByIdController,
  updateUserRoleController,
  updateUserBlockStatusController,
  deleteUserController,
  getResumesController,
  getResumeByIdController,
  deleteResumeController,
  getInterviewsController,
  getInterviewByIdController,
  deleteInterviewController,
} = require("../controllers/admin.controller");

router.get("/dashboard", protect, admin, getDashboardController);
// user management routes
router.get("/users", protect, admin, getUsersController);
router.get("/users/:id", protect, admin, getUserByIdController);
router.patch("/users/:id/role", protect, admin, updateUserRoleController);
router.patch("/users/:id/block",protect,admin,updateUserBlockStatusController,);
router.delete("/users/:id",protect,admin,deleteUserController);
// resumes management routes
router.get("/resumes",protect,admin,getResumesController);
router.get("/resumes/:id",protect,admin,getResumeByIdController);
router.delete("/resumes/:id",protect,admin,deleteResumeController);
// interviews management routes
router.get("/interviews",protect,admin,getInterviewsController);
router.get("/interviews/:id",protect,admin,getInterviewByIdController);
router.delete("/interviews/:id",protect,admin,deleteInterviewController);

module.exports = router;
