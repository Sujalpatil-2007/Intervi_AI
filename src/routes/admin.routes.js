const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const { getDashboardController, getUsersController } = require("../controllers/admin.controller");

router.get("/dashboard", protect, admin, getDashboardController);
router.get("/users", protect, admin, getUsersController);

module.exports = router;
