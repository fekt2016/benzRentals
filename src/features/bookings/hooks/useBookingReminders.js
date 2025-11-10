import { useQuery } from "@tanstack/react-query";
import bookingApi from "../bookingService";

export const useBookingReminders = () => {
  return useQuery({
    queryKey: ["bookingReminders"],
    queryFn: bookingApi.getBookingReminders,
    staleTime: 1000 * 60, // 1 minute (reminders change frequently)
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

