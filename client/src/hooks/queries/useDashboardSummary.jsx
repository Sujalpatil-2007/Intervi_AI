import { useQuery } from "@tanstack/react-query";

import { getDashboardSummary } from "../../api/dashboard.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useDashboardSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_SUMMARY,
    queryFn: getDashboardSummary,
    staleTime: 5 * 60 * 1000,
  });
}