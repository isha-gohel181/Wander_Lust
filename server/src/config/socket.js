// server/src/config/socket.js
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Socket.IO middleware for authentication
  io.use((socket, next) => {
    // Get token from handshake auth or headers
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      // Verify token with Clerk
      // Note: This would need to be replaced with proper Clerk verification
      // For simplicity, we're using a placeholder verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.sub;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  // Handle connections
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Add the user to their own room for targeted messages
    socket.join(`user:${socket.userId}`);

    // Listen for joining a conversation
    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(
        `User ${socket.userId} joined conversation ${conversationId}`
      );
    });

    // Listen for leaving a conversation
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    // Listen for new messages
    socket.on("send_message", (messageData) => {
      // Broadcast to everyone in the conversation except sender
      socket
        .to(`conversation:${messageData.conversationId}`)
        .emit("receive_message", messageData);

      // Also send to specific user if they're not in the conversation currently
      if (messageData.recipientId) {
        socket
          .to(`user:${messageData.recipientId}`)
          .emit("new_message_notification", {
            conversationId: messageData.conversationId,
            senderId: socket.userId,
            message: messageData.content,
          });
      }
    });

    // Listen for typing indicators
    socket.on("typing", (data) => {
      socket.to(`conversation:${data.conversationId}`).emit("user_typing", {
        userId: socket.userId,
        isTyping: data.isTyping,
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
