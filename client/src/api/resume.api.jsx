import axiosClient from "./axios";

export async function uploadResume(formData, onUploadProgress) {
  const response = await axiosClient.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

  return response.data;
}

export async function getMyResume() {
  const response = await axiosClient.get("/resume/me");

  return response.data;
}

export async function deleteResume() {
  const response = await axiosClient.delete("/resume/delete");

  return response.data;
}
