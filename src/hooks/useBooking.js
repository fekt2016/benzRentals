
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import bookingApi from "../services/bookingApi";

// ✅ Create a new booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await bookingApi.createBooking(formData);
      return response;
    },
    onSuccess: () => {
      // 🔥 Refresh bookings immediately
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
    },
  });
};

// ✅ Get all bookings (Admin)
export const useGetBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await bookingApi.getBookings();
      return response.data;
    },
    onSuccess: () => {},
    onError: (error) => {
      console.error("Error fetching bookings:", error);
    },
  });
};

// ✅ Get logged-in user's bookings
export const useMyBookings = () => {
  return useQuery({
    queryKey: ["myBookings"],
    queryFn: async () => {
      const response = await bookingApi.getUserBookings();
      return response;
    },
    onSuccess: () => {},
    onError: (error) => {
      console.error("Error fetching user bookings:", error);
    },
  });
};

// ✅ Get booking by ID
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
    onSuccess: () => {},
    onError: (error) => {
      console.error("Error loading booking:", error);
    },
    enabled: !!id, // only fetch when id exists
  });
};

// ✅ Update user booking (e.g., driver assigned or modified)
export const useUpdateUserBooking = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateBookingStatus", id],
    mutationFn: async (data) => {
      const response = await bookingApi.updateBookingDriver(id, data);
      return response;
    },
    onSuccess: () => {
      // 🔥 Refresh UI after update
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
    onError: (error) => {
      console.error("Error updating booking status:", error);
    },
  });
};

// ✅ Update booking status (Admin)
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }) => {
      const response = await bookingApi.updateBookingStatus(bookingId, status);
      return response.data;
    },
    onSuccess: (data, { bookingId }) => {
      // 🔥 Update specific booking instantly
      queryClient.setQueryData(["booking", bookingId], data);
      // 🔥 Refresh all related data
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
    onError: (error) => {
      console.error("Booking status update failed:", error);
    },
  });
};

// ✅ Add driver to a booking
export const useAddBookingDriver = (bookingId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await bookingApi.addBookingDriver(bookingId, formData);
      return response.data;
    },
    onSuccess: () => {
      // 🔥 Refresh relevant data
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
    onError: (error) => {
      console.error("Error adding driver:", error);
    },
  });
};

// ✅ Cancel a booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, reason }) => {
      const response = await bookingApi.cancelBooking(bookingId, { reason });
      return response.data;
    },
    onSuccess: (data, { bookingId }) => {
      // 🔥 Refresh booking lists and specific booking
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
    onError: (error) => {
      console.error("Failed to cancel booking:", error);
    },
  });
};

// ✅ Check-in booking
export const useCheckInBooking = (bookingId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await bookingApi.checkInBooking(bookingId, formData);
      return response;
    },
    onSuccess: () => {
      // 🔥 Refresh related data
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
    onError: (error) => {
      console.error("Check-in failed:", error);
    },
  });
};

// ✅ Check-out booking
export const useCheckOutBooking = (bookingId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await bookingApi.checkOutBooking(bookingId, formData);
      return response;
    },
    onSuccess: () => {
      // 🔥 Refresh related data
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
    onError: (error) => {
      console.error("Check-out failed:", error);
    },
  });
};

// ✅ Get all bookings for a specific car
export const useGetCarBookings = (carId) => {
  return useQuery({
    queryKey: ["carBookings", carId],
    queryFn: async () => await bookingApi.getCarBookings(carId),
    onSuccess: () => {},
    onError: (error) => {
      console.error("Error fetching car bookings:", error);
    },
    enabled: !!carId, // only run if carId exists
  });
};

