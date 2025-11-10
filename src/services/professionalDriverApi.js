import api from "./api";

const professionalDriverApi = {
  /**
   * Get all professional drivers
   * @param {Object} params - Query parameters (status, available)
   */
  getAllProfessionalDrivers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/professional-drivers${queryString ? `?${queryString}` : ""}`;
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Get available professional drivers for a specific date/time range
   * @param {Object} params - { pickupDate, returnDate, pickupTime, returnTime }
   */
  getAvailableDrivers: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/professional-drivers/available?${queryString}`);
    return response.data;
  },

  /**
   * Get professional driver by ID
   * @param {string} id - Driver ID
   */
  getProfessionalDriverById: async (id) => {
    const response = await api.get(`/professional-drivers/${id}`);
    return response.data;
  },
};

export default professionalDriverApi;

