import api from "./api";

const bookingApi = {
  getBookings: async () => {
    const response = await api.get("/bookings");
    return response;
  },

  getBookingById: async (id) => {
    try {
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
  cancelBooking: async (id) => {
    const response = await api.patch(`/bookings/cancel/${id}`);
    return response;
  },
  getUserBookings: async () => {
    const response = await api.get(`bookings/my-bookings`);
    return response;
  },

  updateBookingDriver: async (id, data) => {
    const headers =
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };
    const response = await api.patch(`/bookings/${id}/driver-documents`, data, {
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
  checkInBooking: async (bookingId, formData) => {
    const headers =
      formData instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };
    const response = await api.post(
      `/bookings/${bookingId}/check-in`,
      formData,
      {
        headers,
      }
    );
    return response;
  },
  checkOutBooking: async (bookingId, formData) => {
    const headers =
      formData instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };
    const response = await api.post(
      `/bookings/${bookingId}/check-out`,
      formData,
      {
        headers,
      }
    );
    return response;
  },

  getCarBookings: async (id) => {
    const response = await api.get(`/bookings/${id}/car`);
    return response;
  },
};
export default bookingApi;
