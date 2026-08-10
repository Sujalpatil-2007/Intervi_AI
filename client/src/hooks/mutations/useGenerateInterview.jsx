import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { generateInterview } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useGenerateInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateInterview,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTERVIEWS,
      });

      toast.success(data?.message || "Interview generated successfully.");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to generate interview.";

      toast.error(message);
    },
  });
}
