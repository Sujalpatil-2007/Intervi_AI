import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { generateInterview } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useGenerateInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateInterview,

    onSuccess: (response) => {
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
        queryKey: QUERY_KEYS.LEADERBOARD,
      });

      toast.success(response?.message || "Interview generated successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to generate interview.",
      );
    },
  });
}
