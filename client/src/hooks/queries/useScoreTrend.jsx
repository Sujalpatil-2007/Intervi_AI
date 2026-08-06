import { useQuery } from "@tanstack/react-query";
import { getScoreTrend } from "../../api/dashboard.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useScoreTrend() {
  return useQuery({
    queryKey: QUERY_KEYS.SCORE_TREND,
    queryFn: getScoreTrend,
    staleTime: 5 * 60 * 1000,
  });
}