import api from "./api";

const bookingApi = {
  getBookings: async () => {
    const response = await api.get("/bookings");
    return response;
  },

  getBookingById: async (id) => {
    try {
      console.log("id api", id);
      const response = await api.get(`/bookings/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching booking by ID:", error);
      throw error;
    }
  },

  createBooking: async (formData) => {
    const response = await api.post("/bookings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  updateBooking: async (id, formData) => {
    const response = await api.patch(`/bookings/${id}`, formData);
    return response;
  },
  getUserBookings: async () => {
    console.log("api Fetching user bookings...");
    const response = await api.get(`bookings/my-bookings`);
    return response;
  },
  // verifyDocuments: async (formData) => {
  //   const response = await api.patch(
  //     `/bookings/${formData.id}/verify-documents`,
  //     formData
  //   );
  //   return response;
  // },
  updateUserBooking: async (id, data) => {
    const headers =
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };
    const response = await api.patch(`/bookings/${id}/documents`, data, {
      headers,
    });
    return response;
  },
  updateBookingStatus: async (id, status) => {
    console.log(" api status", status, id);
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  addBookingDriver: async (bookingId, formData) => {
    const headers =
      formData instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };
    const response = await api.post(`/bookings/${bookingId}/driver`, formData, {
      headers,
    });
    return response.data;
  },
};
export default bookingApi;
