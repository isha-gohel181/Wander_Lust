// client/src/services/messages.js
import api from "./api";

export const messageService = {
  // Get all conversations for the current user (as host or guest)
  getConversations: async () => {
    const response = await api.get("/messages/conversations");
    return response.data;
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId) => {
    const response = await api.get(`/messages/conversations/${conversationId}`);
    return response.data;
  },

  // Start a new conversation with a host about a property
  startConversation: async (data) => {
    const response = await api.post("/messages/conversations", data);
    return response.data;
  },

  // Send a message in an existing conversation
  sendMessage: async (conversationId, message) => {
    const response = await api.post(
      `/messages/conversations/${conversationId}`,
      {
        message,
      }
    );
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (conversationId) => {
    const response = await api.put(
      `/messages/conversations/${conversationId}/read`
    );
    return response.data;
  },
};
