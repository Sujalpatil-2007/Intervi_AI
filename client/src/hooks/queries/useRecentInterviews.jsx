import { useQuery } from "@tanstack/react-query";

import { getRecentInterviews } from "../../api/dashboard.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useRecentInterviews() {
  return useQuery({
    queryKey: QUERY_KEYS.RECENT_INTERVIEWS,
    queryFn: getRecentInterviews,
    staleTime: 5 * 60 * 1000,
  });
}