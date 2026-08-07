import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { uploadResume } from "../../api/resume.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, onUploadProgress }) =>
      uploadResume(formData, onUploadProgress),

    onSuccess: () => {
      toast.success("Resume uploaded successfully.");

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_RESUME,
      });
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to upload resume.");
    },
  });
}
