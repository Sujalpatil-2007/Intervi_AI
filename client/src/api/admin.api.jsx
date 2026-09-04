import api from "./axios";

export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");

  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await api.get("/admin/users", {
    params,
  });

  return response.data;
};

export const getAdminUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);

  return response.data;
};

export const updateAdminUserRole = async (id, data) => {
  const response = await api.patch(`/admin/users/${id}/role`, data);

  return response.data;
};

export const updateAdminUserBlockStatus = async (id, data) => {
  const response = await api.patch(`/admin/users/${id}/block`, data);

  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);

  return response.data;
};

export const getAdminResumes = async (params = {}) => {
  const response = await api.get("/admin/resumes", {
    params,
  });

  return response.data;
};

export const getAdminInterviews = async (params = {}) => {
  const response = await api.get("/admin/interviews", {
    params,
  });

  return response.data;
};

export const getAdminLogs = async (params = {}) => {
  const response = await api.get("/admin/logs", {
    params,
  });

  return response.data;
};