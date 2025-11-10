import { useQuery } from "@tanstack/react-query";
import { getAvailableRequests } from "../services/driverService";

/**
 * Hook for fetching available driver requests
 */
export const useDriverRequests = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["driverRequests"],
    queryFn: async () => {
      const response = await getAvailableRequests();
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    requests: data?.requests || [],
    isLoading,
    error,
    refetch,
  };
};

