import { useQuery } from "@tanstack/react-query";
import { getDriverEarnings } from "../services/driverService";

/**
 * Hook for driver earnings data
 */
export const useDriverEarnings = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["driverEarnings"],
    queryFn: async () => {
      const response = await getDriverEarnings();
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  return {
    earnings: data || {
      totalEarnings: 0,
      totalTrips: 0,
      completedBookings: 0,
      monthlyEarnings: [],
      recentEarnings: [],
    },
    isLoading,
    error,
    refetch,
  };
};

