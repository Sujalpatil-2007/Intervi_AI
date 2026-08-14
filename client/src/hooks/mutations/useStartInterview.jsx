import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { startInterview } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useStartInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startInterview,

    onSuccess: (response, interviewId) => {
      queryClient.setQueryData(
        QUERY_KEYS.INTERVIEW_DETAILS(interviewId),
        response,
      );

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEWS,
      });

      toast.success(response?.message || "Interview started successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Unable to start the interview.",
      );
    },
  });
}