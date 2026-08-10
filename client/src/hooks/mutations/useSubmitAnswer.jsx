import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { submitAnswer } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ interviewId, answerData }) =>
      submitAnswer(interviewId, answerData),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEW_DETAILS(variables.interviewId),
      });

      toast.success(data?.message || "Answer saved successfully.");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to save your answer.";

      toast.error(message);
    },
  });
}
