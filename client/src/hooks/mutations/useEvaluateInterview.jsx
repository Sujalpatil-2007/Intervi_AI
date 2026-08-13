import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { evaluateInterview } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useEvaluateInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluateInterview,

    onSuccess: (response, interviewId) => {
      queryClient.setQueryData(
        QUERY_KEYS.INTERVIEW_EVALUATION(interviewId),
        response,
      );

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEW_DETAILS(interviewId),
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

      toast.success(response?.message || "Interview evaluated successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Unable to evaluate the interview.",
      );
    },
  });
}
