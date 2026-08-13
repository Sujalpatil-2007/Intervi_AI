import { useQuery } from "@tanstack/react-query";

import { getInterviewEvaluation } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useInterviewEvaluation(interviewId) {
  return useQuery({
    queryKey: QUERY_KEYS.INTERVIEW_EVALUATION(interviewId),
    queryFn: () => getInterviewEvaluation(interviewId),
    enabled: Boolean(interviewId),
    staleTime: 5 * 60 * 1000,
  });
}