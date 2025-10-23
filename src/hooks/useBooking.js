// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import bookingApi from "../services/bookingApi";

// export const useCreateBooking = () => {
//   return useMutation({
//     mutationFn: async (formData) => {
//       const response = await bookingApi.createBooking(formData);
//       return response;
//     },
//     onSuccess: (data) => {
//       console.log("Booking created:", data);
//     },
//   });
// };
// export const useGetBookings = () => {
//   return useQuery({
//     queryKey: ["bookings"],
//     queryFn: async () => {
//       const response = await bookingApi.getBookings();
//       return response.data;
//     },
//     onSuccess: (data) => {
//       console.log("Fetched bookings:", data);
//     },
//   });
// };
// export const useMyBookings = () => {
//   return useQuery({
//     queryKey: ["myBookings"],
//     queryFn: async () => {
//       const response = await bookingApi.getUserBookings();
//       return response;
//     },
//     onSuccess: (data) => {
//       console.log("Fetched user bookings:", data);
//     },
//   });
// };

// export const useGetBookingById = (id) => {
//   return useQuery({
//     queryKey: ["booking", id],
//     queryFn: async () => {
//       try {
//         const response = await bookingApi.getBookingById(id);
//         return response;
//       } catch (error) {
//         console.error("Error fetching booking by ID:", error);
//         throw error;
//       }
//     },
//     onSuccess: (data) => {
//       console.log("Fetched booking:", data);
//     },
//   });
// };

// //admin verify documents
// // export const useVerifyDocuments = (id) => {
// //   return useMutation({
// //     mutationKey: ["verifyDocuments", id],
// //     mutationFn: async (formData) => {
// //       console.log("Verifying documents with data:", { ...formData });
// //       const response = await bookingApi.verifyDocuments({ id, ...formData });
// //       return response;
// //     },
// //     onSuccess: (data) => {
// //       console.log("Documents verified:", data);
// //     },
// //   });
// // };

// //user update booking status
// export const useUpdateUserBooking = (id) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationKey: ["updateBookingStatus", id],
//     mutationFn: async (data) => {
//       const response = await bookingApi.updateBookingDriver(id, data);
//       return response;
//     },
//     onSuccess: (data) => {
//       console.log("Booking status updated:", data);
//       queryClient.invalidateQueries(["bookings"]);
//     },
//   });
// };

// export const useUpdateBookingStatus = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ bookingId, status }) => {
//       const response = await bookingApi.updateBookingStatus(bookingId, status);
//       return response.data;
//     },
//     onSuccess: (data, variables) => {
//       // Invalidate and refetch bookings
//       queryClient.invalidateQueries(["bookings"]);
//       queryClient.setQueryData(["bookings", variables.bookingId], data);
//     },
//     onError: (error) => {
//       console.error("Booking status update failed:", error);
//     },
//   });
// };

// export const useAddBookingDriver = (bookingId) => {
//   console.log("useAddBookingDriver bookingId:", bookingId);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (formData) => {
//       const response = await bookingApi.addBookingDriver(bookingId, formData);
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["bookings"] });
//       queryClient.invalidateQueries({ queryKey: ["drivers"] });
//     },
//   });
// };

// export const useCancelBooking = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ bookingId, reason }) => {
    

//       // If your API expects the bookingId in the URL and reason in the body
//       const response = await bookingApi.cancelBooking(bookingId, { reason });
//       return response.data;
//     },
//     onSuccess: (data, variables) => {
//       console.log("Booking cancelled successfully:", data);

//       // Invalidate and refetch bookings
//       queryClient.invalidateQueries({ queryKey: ["bookings"] });

//       // Also invalidate specific booking if needed
//       queryClient.invalidateQueries({
//         queryKey: ["booking", variables.bookingId],
//       });
//     },
//     onError: (error, variables) => {
//       console.error("Failed to cancel booking:", error, variables);
//     },
//   });
// };

// export const useCheckInBooking = (bookingId) => {
 
//   return useMutation({
//     mutationFn: async (formData) => {
//       const response = await bookingApi.checkInBooking(bookingId, formData);
//       return response;
//     },
//   });
// };
// export const useCheckOutBooking = (bookingId) => {
//   return useMutation({
//     mutationFn: async (formData) => {
//       const response = await bookingApi.checkOutBooking(bookingId, formData);
//       return response;
//     },
//   });
// };

// export const useGetCarBookings = (carId) => {
//   return useQuery({
//     queryKey: ["carBookings", carId], // unique cache key
//     queryFn: async () => await bookingApi.getCarBookings(carId),
//     onSuccess: (data) => {
//       console.log("bookings data", data);
//     }, // function that fetches bookings
//     enabled: !!carId, // only run if carId exists
//   });
// };
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
    onSuccess: (data) => {
      console.log("Booking created:", data);
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
    onSuccess: (data) => {
      console.log("Fetched bookings:", data);
    },
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
    onSuccess: (data) => {
      console.log("Fetched user bookings:", data);
    },
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
    onSuccess: (data) => {
      console.log("Fetched booking:", data);
    },
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
    onSuccess: (data) => {
      console.log("Booking status updated:", data);
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
      console.log("Booking status updated:", data);
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
      console.log("Driver added successfully");
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
      console.log("Booking cancelled successfully:", data);
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
    onSuccess: (data) => {
      console.log("Check-in success:", data);
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
    onSuccess: (data) => {
      console.log("Check-out success:", data);
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
    onSuccess: (data) => {
      console.log("Car bookings fetched:", data);
    },
    onError: (error) => {
      console.error("Error fetching car bookings:", error);
    },
    enabled: !!carId, // only run if carId exists
  });
};
