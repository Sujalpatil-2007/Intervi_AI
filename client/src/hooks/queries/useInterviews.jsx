import { useQuery } from "@tanstack/react-query";

import { getInterviews } from "../../api/interview.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useInterviews({ page = 1, limit = 10, status } = {}) {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.INTERVIEWS,
      {
        page,
        limit,
        status: status || null,
      },
    ],
    queryFn: () =>
      getInterviews({
        page,
        limit,
        status,
      }),
    staleTime: 5 * 60 * 1000,
  });
}
