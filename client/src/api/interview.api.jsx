import api from "./axios";

export const generateInterview = async (data) => {
  const response = await api.post("/interviews/generate", data);

  return response.data;
};

export const getInterviews = async ({ page = 1, limit = 10, status } = {}) => {
  const params = {
    page,
    limit,
  };

  if (status) {
    params.status = status;
  }

  const response = await api.get("/interviews", {
    params,
  });

  return response.data;
};

export const getInterviewById = async (id) => {
  const response = await api.get(`/interviews/${id}`);

  return response.data;
};

export const startInterview = async (id) => {
  const response = await api.post(`/interviews/${id}/start`);

  return response.data;
};
export const submitAnswer = async (id, data) => {
  const response = await api.post(`/interviews/${id}/answer`, data);

  return response.data;
};
export const finishInterview = async (id) => {
  const response = await api.post(`/interviews/${id}/finish`);

  return response.data;
};
export const evaluateInterview = async (id) => {
  const response = await api.post(`/interviews/${id}/evaluate`);

  return response.data;
};
export const getInterviewEvaluation = async (id) => {
  const response = await api.get(`/interviews/${id}/evaluation`);

  return response.data;
};