const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const interviewRoutes = require("./routes/interview.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");
const adminRoutes = require("./routes/admin.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const cors = require("cors")

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use("/api/auth",authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", analyticsRoutes);

module.exports = app;