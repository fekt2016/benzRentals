import api from "../../services/apiClient";

const authApi = {
  // Get the currently logged-in user
  getCurrentUser: async () => {
    try {
      // Skip 401 redirect for this request - we handle auth state in components
      // Pass _skip401Redirect in the config object (axios allows custom properties)
      const config = {
        _skip401Redirect: true, // Prevent automatic redirect on 401
      };
      const response = await api.get("/auth/me", config);
      console.log('[authApi.getCurrentUser] Response:', {
        hasData: !!response?.data,
        hasUser: !!response?.data?.data?.user,
        executive: response?.data?.data?.user?.executive,
        role: response?.data?.data?.user?.role,
        fullResponse: response?.data?.data,
      });
      return response?.data?.data;
    } catch (error) {
      console.log('[authApi.getCurrentUser] Error:', error);
      throw error; // Re-throw so React Query can handle it
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
  updateProfile: async (payload) => {
    const response = await api.patch("/auth/update-profile", payload);
    return response.data;
  },
  forgotPassword: async (payload) => {
    const response = await api.post("/auth/forgot-password", payload);
    return response.data;
  },
  resetPassword: async (payload) => {
    const response = await api.patch(`/auth/reset-password/${payload.token}`, payload);
    return response.data;
  },
  changePassword: async (payload) => {
    const response = await api.patch("/auth/updateMyPassword", payload);
    return response.data;
  },
  uploadAvatar: async (payload) => {
    const response = await api.patch("/auth/upload-avatar", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default authApi;
