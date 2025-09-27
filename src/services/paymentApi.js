import api from "./api";

const paymentApi = {
  stripePayment: async (body) => {
    console.log("Sending payment data:", body);

    try {
      // Your api.post likely already returns parsed JSON
      const response = await api.post("/payment/create-checkout-session", body);
      return response;
    } catch (error) {
      console.error("Payment API error:", error);
      throw new Error(error.message || "Payment failed");
    }
  },
  verifyPayment: async (sessionId, bookingId) => {
    try {
      const response = await api.get(
        `/payment/verify-payment/${sessionId}/${bookingId}`
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  },
  getBookingConfirmation: async (bookingId) => {
    try {
      const response = await api.get(`payment/confirmation/${bookingId}`);
      return response;
    } catch (error) {
      console.error("confirmation API error:", error);
      throw new Error(error.message || "Payment failed");
    }
  },
};
export default paymentApi;
