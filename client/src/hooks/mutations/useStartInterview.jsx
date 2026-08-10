import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { startInterview } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useStartInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startInterview,

    onSuccess: (data, interviewId) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEWS,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEW_DETAILS(interviewId),
      });

      toast.success(
        data?.message || "Interview started successfully.",
      );
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Failed to start interview.";

      toast.error(message);
    },
  });
};
