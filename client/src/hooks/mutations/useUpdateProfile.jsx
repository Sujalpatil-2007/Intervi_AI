import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateProfile } from "../../api/auth.api";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (response) => {
      queryClient.setQueryData(["currentUser"], response);

      toast.success(
        response?.message || "Profile updated successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update profile."
      );
    },
  });
}