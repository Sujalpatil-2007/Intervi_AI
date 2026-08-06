import { useQuery } from "@tanstack/react-query";
import { getSkillPerformance } from "../../api/dashboard.api";
import { QUERY_KEYS } from "../../utils/queryKeys";

export function useSkills() {
  return useQuery({
    queryKey: QUERY_KEYS.SKILLS,
    queryFn: getSkillPerformance,
    staleTime: 5 * 60 * 1000,
  });
}