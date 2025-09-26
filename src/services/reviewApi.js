import api from "./api";

const reviewApi = {
  createReview: async (formData) => {
    console.log("api payload", formData);
    const response = await api.post("/reviews", formData);
    return response;
  },
  getCarReview: async (carId) => {
    const response = await api.get(`/reviews/car/${carId}`);
    return response;
  },
};
export default reviewApi;
