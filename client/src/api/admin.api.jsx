import api from "./axios";

/* Dashboard */

export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

/* Users */

export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getUser = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUserRole = async (id, data) => {
  const response = await api.patch(`/admin/users/${id}/role`, data);
  return response.data;
};

export const updateUserBlockStatus = async (id, data) => {
  const response = await api.patch(`/admin/users/${id}/block`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

/* Resumes */

export const getAdminResumes = async () => {
  const response = await api.get("/admin/resumes");
  return response.data;
};

export const getAdminResume = async (id) => {
  const response = await api.get(`/admin/resumes/${id}`);
  return response.data;
};

export const deleteAdminResume = async (id) => {
  const response = await api.delete(`/admin/resumes/${id}`);
  return response.data;
};

/* Interviews */

export const getAdminInterviews = async () => {
  const response = await api.get("/admin/interviews");
  return response.data;
};

export const getAdminInterview = async (id) => {
  const response = await api.get(`/admin/interviews/${id}`);
  return response.data;
};

export const deleteAdminInterview = async (id) => {
  const response = await api.delete(`/admin/interviews/${id}`);
  return response.data;
};

/* Analytics */

export const getUserAnalytics = async () => {
  const response = await api.get("/admin/analytics/users");
  return response.data;
};

export const getResumeAnalytics = async () => {
  const response = await api.get("/admin/analytics/resumes");
  return response.data;
};

export const getInterviewAnalytics = async () => {
  const response = await api.get("/admin/analytics/interviews");
  return response.data;
};

export const getPerformanceAnalytics = async () => {
  const response = await api.get("/admin/analytics/performance");
  return response.data;
};

/* Audit Logs */

export const getAuditLogs = async (params = {}) => {
  const response = await api.get("/admin/logs", { params });
  return response.data;
};

/* CSV Export */

export const exportUsersCSV = async () => {
  const response = await api.get("/admin/export/users", {
    responseType: "blob",
  });
  return response.data;
};

export const exportResumesCSV = async () => {
  const response = await api.get("/admin/export/resumes", {
    responseType: "blob",
  });
  return response.data;
};

export const exportInterviewsCSV = async () => {
  const response = await api.get("/admin/export/interviews", {
    responseType: "blob",
  });
  return response.data;
};

export const exportLogsCSV = async () => {
  const response = await api.get("/admin/export/logs", {
    responseType: "blob",
  });
  return response.data;
};
