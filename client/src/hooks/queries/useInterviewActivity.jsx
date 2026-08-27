import { useQuery } from "@tanstack/react-query";

import { getInterviews } from "../../api/interview.api";

export function useInterviewActivity() {
  return useQuery({
    queryKey: ["interview-activity"],
    queryFn: () =>
      getInterviews({
        page: 1,
        limit: 100,
      }),
  });
}
