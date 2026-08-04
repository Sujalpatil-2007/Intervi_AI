import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteResume } from "../../api/resume.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResume,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RESUMES,
      });
    },
  });
}