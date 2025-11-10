import api from "../../services/apiClient";

/**
 * Chat Service
 * Handles all chat-related API calls
 */
const chatApi = {
  // Start a new chat session
  startChat: async () => {
    const response = await api.post("/chat/start");
    return response.data;
  },

  // Send a message and get bot response
  sendMessage: async (message, sessionId) => {
    const response = await api.post("/chat/send", {
      message,
      sessionId,
    });
    return response.data;
  },

  // Get chat history
  getChatHistory: async () => {
    const response = await api.get("/chat/history");
    return response.data;
  },

  // Get active chat session
  getActiveSession: async () => {
    const response = await api.get("/chat/active");
    return response.data;
  },

  // Close a chat session
  closeSession: async (sessionId) => {
    const response = await api.patch(`/chat/close/${sessionId}`);
    return response.data;
  },

  // Escalate chat to human agent
  escalateChat: async (sessionId) => {
    const response = await api.post(`/chat/escalate/${sessionId}`);
    return response.data;
  },
};

export default chatApi;

