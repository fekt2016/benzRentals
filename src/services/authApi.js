import api from "./api";

const authApi = {
  // Login with email/phone and password
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Get the currently logged-in user
  getCurrentUser: async () => {
    const response = await api.get("/auth/me"); // your backend endpoint
    return response.data.data.user;
  },

  // Logout user
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
  sendOtp: async (email) => {
    const response = await api.post("/auth/send-otp", { email });
    return response.data;
  },
  verifyOtp: async (email, otp) => {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return response.data;
  },
  register: async (username, email, phone, password) => {
    const response = await api.post("/auth/signup", {
      username,
      email,
      phone,
      password,
    });
    return response.data;
  },
};

export default authApi;
