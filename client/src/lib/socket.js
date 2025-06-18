// client/src/lib/socket.js
import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = async (token) => {
  if (socket) return socket;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  socket = io(API_URL, {
    auth: { token },
  });

  // Log socket connection events
  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// These utility functions make working with the socket easier
export const joinConversation = (conversationId) => {
  if (socket) {
    socket.emit("join_conversation", conversationId);
  }
};

export const leaveConversation = (conversationId) => {
  if (socket) {
    socket.emit("leave_conversation", conversationId);
  }
};

export const sendMessage = (messageData) => {
  if (socket) {
    socket.emit("send_message", messageData);
  }
};

export const sendTypingStatus = (conversationId, isTyping) => {
  if (socket) {
    socket.emit("typing", { conversationId, isTyping });
  }
};
