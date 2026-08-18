import { useQuery } from "@tanstack/react-query";

import { getInterviewById } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useInterviewDetails(id) {
  return useQuery({
    queryKey: QUERY_KEYS.INTERVIEW_DETAILS(id),
    queryFn: () => getInterviewById(id),
    enabled: !!id,
  });
}
