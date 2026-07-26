const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function protect(req, res, next) {
  try {
    let token;

    // Token from cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Token from Authorization header
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

module.exports = protect;