import { useQuery } from "@tanstack/react-query";

import { getMyResume } from "../../api/resume.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useMyResume() {
  return useQuery({
    queryKey: QUERY_KEYS.MY_RESUME,
    queryFn: getMyResume,
    staleTime: 5 * 60 * 1000,
  });
}