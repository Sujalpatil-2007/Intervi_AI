const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const { getDashboardController } = require("../controllers/admin.controller");

router.get("/dashboard", protect, admin, getDashboardController);

module.exports = router;
