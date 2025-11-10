import { useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "../userService";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../config/constants";

/**
 * Hook to delete user account
 * @returns {Object} Mutation object with mutate function
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await userService.deleteAccount();
        return response;
      } catch (error) {
        console.error("[useDeleteAccount] Error deleting account:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      // Clear cookies/localStorage if needed
      // Cookies.remove("token");
      
      // Redirect to login
      navigate(PATHS.LOGIN, { replace: true });
    },
  });
};

