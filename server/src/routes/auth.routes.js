const express = require("express");
const authController = require("../controllers/auth.controllers");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

/* POST /api/auth/register */
router.post("/register", authController.userRegisterController);

/* POST /api/auth/login */
router.post("/login", authController.userLoginController);

/* POST /api/auth/logout */
router.post("/logout", protect, authController.userLogoutController);

/* GET /api/auth/me */
router.get("/me", protect, authController.getCurrentUserController);

// PUT /api/auth/profile
router.put("/profile", protect, authController.updateProfileController);

module.exports = router;
