import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { finishInterview } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useFinishInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finishInterview,

    onSuccess: (response, interviewId) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEW_DETAILS(interviewId),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEWS,
      });

      toast.success(
        response?.message ||
          "Interview completed successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to finish the interview.",
      );
    },
  });
};
