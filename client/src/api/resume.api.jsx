import axiosClient from "./axios";

export async function uploadResume(formData, onUploadProgress) {
  console.log("API FormData:", formData);
  console.log("API resume file:", formData.get("resume"));

  const response = await axiosClient.post(
    "/resume/upload",
    formData,
    {
      onUploadProgress,
    }
  );

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