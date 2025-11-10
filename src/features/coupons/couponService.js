import api from "../../services/apiClient";

const couponApi = {
  validateCoupon: async (code, bookingTotal) => {
    const response = await api.post("/coupons/validate", {
      code,
      bookingTotal,
    });
    return response.data;
  },
};

export default couponApi;

