export const QUERY_KEYS = {
  // Authentication
  AUTH: ["auth"],

  // Dashboard
  DASHBOARD_SUMMARY: ["dashboard-summary"],
  DASHBOARD_RECENT: ["dashboard-recent"],
  SCORE_TREND: ["score-trend"],
  SKILLS: ["skills"],
  LEADERBOARD: ["leaderboard"],

  // Resume
  RESUMES: ["resumes"],
  MY_RESUME: ["my-resume"],
  RESUME_DETAILS: (id) => ["resume", id],

  // Interview
  INTERVIEWS: ["interviews"],
  INTERVIEW_DETAILS: (id) => ["interview", id],
  INTERVIEW_EVALUATION: (id) => ["interview-evaluation", id],

  // Admin
  ADMIN_DASHBOARD: ["admin-dashboard"],
  ADMIN_USERS: ["admin-users"],
  ADMIN_RESUMES: ["admin-resumes"],
  ADMIN_INTERVIEWS: ["admin-interviews"],
  ADMIN_ANALYTICS: ["admin-analytics"],
  ADMIN_LOGS: ["admin-logs"],
};
