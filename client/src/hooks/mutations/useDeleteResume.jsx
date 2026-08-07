import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteResume } from "../../api/resume.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResume,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_RESUME,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RESUMES,
      });

      toast.success(data?.message || "Resume deleted successfully.");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to delete resume.";

      toast.error(message);
    },
  });
}
