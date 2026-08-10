import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { finishInterview } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useFinishInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finishInterview,

    onSuccess: (data, interviewId) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEWS,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEW_DETAILS(interviewId),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DASHBOARD_SUMMARY,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DASHBOARD_RECENT,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SCORE_TREND,
      });

      toast.success(data?.message || "Interview completed successfully.");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to finish interview.";

      toast.error(message);
    },
  });
}
