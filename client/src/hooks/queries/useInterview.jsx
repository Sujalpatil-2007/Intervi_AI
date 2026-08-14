import { useQuery } from "@tanstack/react-query";

import { getInterviewById } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useInterview(id) {
  return useQuery({
    queryKey: QUERY_KEYS.INTERVIEW_DETAILS(id),
    queryFn: () => getInterviewById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}