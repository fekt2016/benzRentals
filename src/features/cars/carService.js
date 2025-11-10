import api from "../../services/apiClient";

const carApi = {
  getCars: async () => {
    const response = await api.get("/cars");
    return response;
  },

  getCarById: async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response;
  },

  createCar: async (formData) => {
    console.log("api create car")
    const response = await api.post("/cars", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  updateCar: async (id, formData) => {
    const response = await api.patch(`/cars/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  deleteCar: async (id) => {
    const response = await api.delete(`/cars/${id}`);
    return response;
  },
  getCarsStatus: async (status) => {
    console.log("api status", status);
    let url = "/cars/models";
    if (status) {
      // If multiple statuses are passed as array, join them with commas
      if (Array.isArray(status)) {
        url += `?status=${status.join(",")}`;
      } else {
        url += `?status=${status}`;
      }
    }
    console.log("api url", url);
    const response = await api.get(url);
    return response;
  },
  
  getCarAvailability: async (carId, startDate, endDate) => {
    let url = `/cars/${carId}/availability`;
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (params.toString()) url += `?${params.toString()}`;
    const response = await api.get(url);
    return response.data;
  },
};
export default carApi;
