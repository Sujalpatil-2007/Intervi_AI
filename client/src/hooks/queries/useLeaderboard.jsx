import { useQuery } from "@tanstack/react-query";

import { getLeaderboard } from "../../api/dashboard.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useLeaderboard() {
  return useQuery({
    queryKey: QUERY_KEYS.LEADERBOARD,
    queryFn: getLeaderboard,
    staleTime: 5 * 60 * 1000,
  });
}