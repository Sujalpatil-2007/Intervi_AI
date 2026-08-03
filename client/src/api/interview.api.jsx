import api from "./axios";

export const generateInterview = async (data) => {
  const response = await api.post("/interview/generate", data);
  return response.data;
};

export const getInterviews = async () => {
  const response = await api.get("/interview");
  return response.data;
};

export const getInterviewById = async (id) => {
  const response = await api.get(`/interview/${id}`);
  return response.data;
};

export const startInterview = async (id) => {
  const response = await api.post(`/interview/${id}/start`);
  return response.data;
};

export const submitAnswer = async (id, data) => {
  const response = await api.post(`/interview/${id}/answer`, data);
  return response.data;
};

export const finishInterview = async (id) => {
  const response = await api.post(`/interview/${id}/finish`);
  return response.data;
};

export const evaluateInterview = async (id) => {
  const response = await api.post(`/interview/${id}/evaluate`);
  return response.data;
};

export const getInterviewEvaluation = async (id) => {
  const response = await api.get(`/interview/${id}/evaluation`);
  return response.data;
};
