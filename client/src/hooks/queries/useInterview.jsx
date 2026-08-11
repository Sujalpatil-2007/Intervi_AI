import { useQuery } from "@tanstack/react-query";

import { getInterviewById } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useInterview(interviewId) {
  return useQuery({
    queryKey: QUERY_KEYS.INTERVIEW_DETAILS(interviewId),
    queryFn: () => getInterviewById(interviewId),
    enabled: Boolean(interviewId),
    staleTime: 0,
  });
}

