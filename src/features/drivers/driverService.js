import api from "../../services/apiClient";

const driverApi = {
  getUserDrivers: async () => {
    const response = await api.get("/drivers/user-drivers");
    return response.data;
  },

  verifyDriver: async (driverId, data) => {
    const response = await api.patch(`/drivers/verify/${driverId}`, data);
    return response.data;
  },
  getAllDrivers: async (params = {}) => {
    const response = await api.get("/drivers", { params });
    return response.data; // Return response.data to match other API calls
  },
  // Professional Drivers API
  getAllProfessionalDrivers: async (params = {}) => {
    // Use admin route if called from admin context, otherwise use public route
    const endpoint = params.useAdminRoute
      ? "/professional-drivers/admin/all"
      : "/professional-drivers";
    // Remove useAdminRoute from params before sending
    const { useAdminRoute, ...queryParams } = params;
    const response = await api.get(endpoint, { params: queryParams });
    return response.data;
  },
  getProfessionalDriverById: async (id) => {
    const response = await api.get(`/professional-drivers/${id}`);
    return response.data;
  },
  createProfessionalDriver: async (data) => {
    const response = await api.post("/professional-drivers", data);
    return response.data;
  },
  updateProfessionalDriver: async (id, data) => {
    const response = await api.patch(`/professional-drivers/${id}`, data);
    return response.data;
  },
  deleteProfessionalDriver: async (id) => {
    const response = await api.delete(`/professional-drivers/${id}`);
    return response.data;
  },
  getDriverAvailabilitySummary: async () => {
    const response = await api.get("/drivers/availability-summary");
    // Handle both response structures: { success: true, ... } or { status: "success", data: ... }
    if (response.data.success) {
      return response.data;
    }
    return response.data?.data || response.data;
  },
};

export default driverApi;
