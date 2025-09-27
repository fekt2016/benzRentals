// services/notificationService.js
import api from "./api";

export const notificationService = {
  // Get notifications for user/admin
  getNotifications: async (userId, userType = "user", params = {}) => {
    const response = await api.get(`/notifications/${userType}/${userId}`, {
      params,
    });
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (userId, userType = "user") => {
    const response = await api.get(
      `/notifications/${userType}/${userId}/unread-count`
    );
    return response.data;
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async (userId, userType = "user") => {
    const response = await api.put(
      `/notifications/${userType}/${userId}/read-all`
    );
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Clear all notifications
  clearAll: async (userId, userType = "user") => {
    const response = await api.delete(
      `/notifications/${userType}/${userId}/clear`
    );
    return response.data;
  },

  // Create notification (for admin to send to users)
  createNotification: async (notificationData) => {
    const response = await api.post("/notifications", notificationData);
    return response.data;
  },

  // Subscribe to real-time updates (WebSocket)
  subscribeToNotifications: (userId, callback) => {
    // WebSocket implementation would go here
    const ws = new WebSocket(
      `ws://localhost:3001/notifications?userId=${userId}`
    );

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      callback(notification);
    };

    return () => ws.close();
  },
};
