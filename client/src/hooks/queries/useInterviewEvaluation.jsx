import { useQuery } from "@tanstack/react-query";

import { getInterviewEvaluation } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useInterviewEvaluation(id) {
  return useQuery({
    queryKey: QUERY_KEYS.INTERVIEW_EVALUATION(id),
    queryFn: () => getInterviewEvaluation(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
};
