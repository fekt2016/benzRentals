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
  getUserReviews: async (userId) => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response;
  },
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response;
  },
  updateReview: async (id, formData) => {
    const response = await api.patch(`/reviews/${id}`, formData);
    return response;
  },
};
export default reviewApi;
