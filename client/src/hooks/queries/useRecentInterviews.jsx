import { useQuery } from "@tanstack/react-query";

import { getRecentActivity } from "../../api/dashboard.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useRecentInterviews() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_RECENT,
    queryFn: getRecentActivity,
    staleTime: 5 * 60 * 1000,
  });
}
