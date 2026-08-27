import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { logoutUser } from "../../api/auth.api";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: (response) => {
      queryClient.clear();

      toast.success(response?.message || "Logged out successfully.");

      window.location.href = "/login";
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Unable to logout.");
    },
  });
}
