import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { submitAnswer } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ interviewId, questionId, answer, timeTaken }) =>
      submitAnswer(interviewId, {
        questionId,
        answer,
        timeTaken,
      }),

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEW_DETAILS(variables.interviewId),
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to save your answer.",
      );
    },
  });
}
