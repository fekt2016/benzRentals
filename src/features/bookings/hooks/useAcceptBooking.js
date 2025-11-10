import { useMutation, useQueryClient } from "@tanstack/react-query";
import bookingApi from "../bookingService";
import { toast } from "react-hot-toast";

export const useAcceptBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId) => bookingApi.acceptDriverRequest(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking accepted successfully! 🚗");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to accept booking"
      );
    },
  });
};

