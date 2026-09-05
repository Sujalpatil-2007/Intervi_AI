import { useQuery } from "@tanstack/react-query";
import { getAdminUserById } from "../../api/admin.api";

export const useAdminUser = (id) => {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => getAdminUserById(id),
    enabled: Boolean(id),
  });
};