import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { evaluateInterview } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useEvaluateInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluateInterview,

    onSuccess: (data, interviewId) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEW_DETAILS(interviewId),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEW_EVALUATION(interviewId),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEWS,
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

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SKILLS,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.LEADERBOARD,
      });

      toast.success(data?.message || "Interview evaluated successfully.");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to evaluate interview.";

      toast.error(message);
    },
  });
}
