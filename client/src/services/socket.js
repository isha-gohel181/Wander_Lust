// client/src/services/socket.js
import { io } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";

let socket;

export const initializeSocket = async (token) => {
  if (socket) return socket;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  socket = io(API_URL, {
    auth: { token },
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const joinConversation = useCallback((conversationId) => {
    if (socket) {
      socket.emit("join_conversation", conversationId);
    }
  }, []);

  const leaveConversation = useCallback((conversationId) => {
    if (socket) {
      socket.emit("leave_conversation", conversationId);
    }
  }, []);

  const sendMessage = useCallback((messageData) => {
    if (socket) {
      socket.emit("send_message", messageData);
    }
  }, []);

  const sendTypingStatus = useCallback((conversationId, isTyping) => {
    if (socket) {
      socket.emit("typing", { conversationId, isTyping });
    }
  }, []);

  return {
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTypingStatus,
    socket,
  };
};
