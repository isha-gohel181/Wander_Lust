//src/services/socket.js
import { io } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";

let socket;

export const initializeSocket = async (token) => {
  if (socket) return socket;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:10000";

  socket = io(API_URL, {
    auth: { token },
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

  const joinConversationHook = useCallback((conversationId) => {
    joinConversation(conversationId);
  }, []);

  const leaveConversationHook = useCallback((conversationId) => {
    leaveConversation(conversationId);
  }, []);

  const sendMessageHook = useCallback((messageData) => {
    sendMessage(messageData);
  }, []);

  const sendTypingStatusHook = useCallback((conversationId, isTyping) => {
    sendTypingStatus(conversationId, isTyping);
  }, []);

  return {
    isConnected,
    joinConversation: joinConversationHook,
    leaveConversation: leaveConversationHook,
    sendMessage: sendMessageHook,
    sendTypingStatus: sendTypingStatusHook,
    socket,
  };
};
