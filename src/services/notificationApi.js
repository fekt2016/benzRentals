import api from "./api";

const notificationApi = {
  // Get notifications with pagination
  getNotifications: async (params = {}) => {
    try {
      // Build query string from params
      const queryString = new URLSearchParams();

      if (params.page) queryString.append("page", params.page);
      if (params.limit) queryString.append("limit", params.limit);
      if (params.sort) queryString.append("sort", params.sort);
      if (params.read !== undefined) queryString.append("read", params.read);
      if (params.type) queryString.append("type", params.type);
      if (params.from) queryString.append("from", params.from);
      if (params.to) queryString.append("to", params.to);

      const url = `/notifications/my${
        queryString.toString() ? `?${queryString}` : ""
      }`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await api.get("/notifications/unread-count");
      return response;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  },

  // Create notification
  createNotification: async (data) => {
    try {
      const response = await api.post("/notifications", data);
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await api.patch("/notifications/mark-all-read");
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
};

export default notificationApi;
