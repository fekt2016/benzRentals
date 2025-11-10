import { useQuery } from "@tanstack/react-query";
import userService from "../userService";

/**
 * Hook to fetch user settings
 * @param {Object} options - React Query options
 * @returns {Object} Query result with settings data
 */
export const useUserSettings = (options = {}) => {
  return useQuery({
    queryKey: ["userSettings"],
    queryFn: async () => {
      try {
        const response = await userService.getSettings();
        return response;
      } catch (error) {
        console.error("[useUserSettings] Error fetching settings:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    ...options,
  });
};

