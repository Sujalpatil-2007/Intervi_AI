import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { uploadResume } from "../../api/resume.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, onUploadProgress }) => {
      return uploadResume(formData, onUploadProgress);
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_RESUME,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RESUMES,
      });

      toast.success(
        response?.message || "Resume uploaded successfully."
      );
    },

    onError: (error) => {
      console.error("UPLOAD ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to upload resume."
      );
    },
  });
}