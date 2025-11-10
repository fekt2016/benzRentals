import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDriverBookings, acceptBookingRequest } from "../services/driverService";
import { toast } from "react-hot-toast";

/**
 * Hook for managing driver bookings
 */
export const useDriverBookings = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["driverBookings"],
    queryFn: async () => {
      const response = await getDriverBookings();
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const acceptMutation = useMutation({
    mutationFn: async (bookingId) => {
      const response = await acceptBookingRequest(bookingId);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["driverBookings"] });
      queryClient.invalidateQueries({ queryKey: ["driverRequests"] });
      toast.success("Booking accepted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to accept booking");
    },
  });

  return {
    bookings: data?.bookings || [],
    isLoading,
    error,
    refetch,
    acceptBooking: acceptMutation.mutate,
    isAccepting: acceptMutation.isPending,
  };
};

