import apiClient from "../../../services/apiClient";

/**
 * Driver Service
 * Handles all driver-related API calls
 */

// Get driver profile
export const getDriverProfile = async () => {
  const response = await apiClient.get("/driver/me");
  return response.data;
};

// Update driver status
export const updateDriverStatus = async (status) => {
  const response = await apiClient.patch("/driver/status", { status });
  return response.data;
};

// Get available ride requests
export const getAvailableRequests = async () => {
  const response = await apiClient.get("/driver/requests");
  return response.data;
};

// Get driver's bookings
export const getDriverBookings = async () => {
  const response = await apiClient.get("/driver/bookings");
  return response.data;
};

// Get driver earnings
export const getDriverEarnings = async () => {
  const response = await apiClient.get("/driver/earnings");
  return response.data;
};

// Update driver documents
export const updateDriverDocuments = async (formData) => {
  const response = await apiClient.patch("/driver/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Register as driver
export const registerDriver = async (data) => {
  const response = await apiClient.post("/driver/register", data);
  return response.data;
};

// Accept a booking request
export const acceptBookingRequest = async (bookingId) => {
  const response = await apiClient.post(`/bookings/${bookingId}/accept-driver`);
  return response.data;
};

