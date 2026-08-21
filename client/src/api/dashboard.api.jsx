import api from "./axios";

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

export const getRecentActivity = async () => {
  const response = await api.get("/dashboard/recent");
  return response.data;
};

export const getScoreTrend = async () => {
  const response = await api.get("/dashboard/score-trend");
  return response.data;
};

export const getSkillPerformance = async () => {
  const response = await api.get("/dashboard/skills");
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await api.get("/leaderboard");
  return response.data;
};