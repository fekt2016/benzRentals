import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import bookingApi from "../services/bookingApi";

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await bookingApi.createBooking(formData);
      return response;
    },
    onSuccess: (data) => {
      console.log("Booking created:", data);
    },
  });
};
export const useGetBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await bookingApi.getBookings();
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Fetched bookings:", data);
    },
  });
};
export const useMyBookings = () => {
  return useQuery({
    queryKey: ["myBookings"],
    queryFn: async () => {
      const response = await bookingApi.getUserBookings();
      return response;
    },
    onSuccess: (data) => {
      console.log("Fetched user bookings:", data);
    },
  });
};

export const useGetBookingById = (id) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      try {
        const response = await bookingApi.getBookingById(id);
        return response;
      } catch (error) {
        console.error("Error fetching booking by ID:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Fetched booking:", data);
    },
  });
};

//admin verify documents
// export const useVerifyDocuments = (id) => {
//   return useMutation({
//     mutationKey: ["verifyDocuments", id],
//     mutationFn: async (formData) => {
//       console.log("Verifying documents with data:", { ...formData });
//       const response = await bookingApi.verifyDocuments({ id, ...formData });
//       return response;
//     },
//     onSuccess: (data) => {
//       console.log("Documents verified:", data);
//     },
//   });
// };

//user update booking status
export const useUpdateUserBooking = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateBookingStatus", id],
    mutationFn: async (data) => {
      const response = await bookingApi.updateBookingDriver(id, data);
      return response;
    },
    onSuccess: (data) => {
      console.log("Booking status updated:", data);
      queryClient.invalidateQueries(["bookings"]);
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }) => {
      const response = await bookingApi.updateBookingStatus(bookingId, status);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries(["bookings"]);
      queryClient.setQueryData(["bookings", variables.bookingId], data);
    },
    onError: (error) => {
      console.error("Booking status update failed:", error);
    },
  });
};

export const useAddBookingDriver = (bookingId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await bookingApi.addBookingDriver(bookingId, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, reason }) => {
      console.log("Cancelling booking:", { bookingId, reason });

      // If your API expects the bookingId in the URL and reason in the body
      const response = await bookingApi.cancelBooking(bookingId, { reason });
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log("Booking cancelled successfully:", data);

      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });

      // Also invalidate specific booking if needed
      queryClient.invalidateQueries({
        queryKey: ["booking", variables.bookingId],
      });
    },
    onError: (error, variables) => {
      console.error("Failed to cancel booking:", error, variables);
    },
  });
};

export const useCheckInBooking = (bookingId) => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await bookingApi.CheckInBooking(bookingId, formData);
      return response;
    },
  });
};
