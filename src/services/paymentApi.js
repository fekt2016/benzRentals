import api from "./api";

const paymentApi = {
  stripePayment: async (body) => {
    try {
      const response = await api.post("/payment/create-checkout-session", body);
      return response;
    } catch (error) {
      console.error("[PaymentAPI] Payment API error:", {
        message: error.message,
        code: error.code,
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: {
            'access-control-allow-origin': error.response?.headers?.['access-control-allow-origin'],
            'access-control-allow-credentials': error.response?.headers?.['access-control-allow-credentials'],
          },
        },
        request: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        },
      });
      
      // Check for CORS-specific errors
      if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS') || error.message?.includes('blocked')) {
        throw new Error(
          `CORS Error: Request blocked. Origin: ${window.location.origin}. ` +
          `Please ensure the backend allows requests from this origin.`
        );
      }
      
      throw new Error(error.response?.data?.message || error.message || "Payment failed");
    }
  },
  verifyPayment: async (sessionId, bookingId) => {
    try {
      const response = await api.get(
        `/payment/verify-payment/${sessionId}/${bookingId}`
      );
      return response;
    } catch (err) {
      throw err;
    }
  },
  getBookingConfirmation: async (bookingId) => {
    try {
      if (!bookingId) {
        throw new Error("Booking ID is required");
      }
      
      const response = await api.get(`/payment/confirmation/${bookingId}`);
      return response;
    } catch (error) {
      console.error("[PaymentAPI] Confirmation API error:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
      
      // Provide more specific error messages
      if (error.response?.status === 404) {
        throw new Error("Booking not found. Please check your booking ID.");
      } else if (error.response?.status === 401) {
        throw new Error("You need to be logged in to view this booking.");
      } else if (error.response?.status === 403) {
        throw new Error("You don't have permission to view this booking.");
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error("Network error. Please check your connection and try again.");
      }
      
      throw new Error(error.response?.data?.message || error.message || "Failed to load booking confirmation");
    }
  },
};
export default paymentApi;
