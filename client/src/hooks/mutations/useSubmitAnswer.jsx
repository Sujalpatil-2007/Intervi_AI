import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { submitAnswer } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useSubmitAnswer(interviewId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => submitAnswer(interviewId, data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEW_DETAILS(interviewId),
      });

      toast.success(response?.message || "Answer saved successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to save your answer.",
      );
    },
  });
}
