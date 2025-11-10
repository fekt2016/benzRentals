import { useQuery } from "@tanstack/react-query";
import driverApi from "../driverService";

/**
 * Hook to fetch driver availability summary (Admin only)
 * Auto-refreshes every 10 seconds for real-time updates
 */
export const useGetDriverAvailability = () => {
  return useQuery({
    queryKey: ["driver-availability"],
    queryFn: async () => {
      try {
        const response = await driverApi.getDriverAvailabilitySummary();
        console.log("[useGetDriverAvailability] Response:", response);
        return response;
      } catch (error) {
        console.error("[useGetDriverAvailability] Error:", error);
        throw error;
      }
    },
    refetchInterval: 10000, // Auto-refresh every 10 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
    retry: 2, // Retry failed requests
  });
};

