import api from "./api";

const driverApi = {
  getUserDrivers: async () => {
    const response = await api.get("/drivers/user-drivers");
    return response.data;
  },

  verifyDriver: async (driverId, data) => {
    const response = await api.patch(`/drivers/${driverId}`, data);
    return response.data;
  },
};

export default driverApi;
