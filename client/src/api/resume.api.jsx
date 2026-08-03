import api from "./axios";

export const uploadResume = async (formData) => {
  const response = await api.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getMyResumes = async () => {
  const response = await api.get("/resume/my");
  return response.data;
};

export const deleteResume = async (resumeId) => {
  const response = await api.delete(`/resume/${resumeId}`);
  return response.data;
};
