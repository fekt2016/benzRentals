import api from "./api";

const authApi = {
  // Get the currently logged-in user
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me"); // your backend endpoint
      return response?.data?.data;
    } catch (error) {
      console.log(error);
    }
  },

  // Logout user
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
  login: async (payload) => {
    const response = await api.post("/auth/login", payload);
    return response.data;
  },
  verifyOtp: async (payload) => {
    try {
      const response = await api.post("/auth/verify-otp", payload);
      return response;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error; // Propagate error to React Query
    }
  },
  resendOtp: async (phone) => {
    const response = await api.post("/auth/resend-otp", { phone });
    return response;
  },
  register: async (payload) => {
    const response = await api.post("/auth/signup", payload);
    return response.data;
  },
};

export default authApi;
