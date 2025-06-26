//server/src/config/socket.js
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: [
        "https://wander-lust-red.vercel.app",
        "http://localhost:5173",
        "http://localhost:10000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware (auth optional in dev mode)
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    // In development mode, allow all connections without verification
    if (process.env.NODE_ENV === "development" || !process.env.JWT_SECRET) {
      socket.userId = "dev_user"; // Dummy ID
      return next();
    }

    if (!token) {
      return next(new Error("Authentication error: No token"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.sub || decoded.id; // use .sub or .id depending on how you signed
      next();
    } catch (error) {
      console.error("JWT Error:", error.message);
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    socket.join(`user:${socket.userId}`);

    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(
        `User ${socket.userId} joined conversation ${conversationId}`
      );
    });

    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    socket.on("send_message", (messageData) => {
      socket
        .to(`conversation:${messageData.conversationId}`)
        .emit("receive_message", messageData);

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

    socket.on("typing", (data) => {
      socket.to(`conversation:${data.conversationId}`).emit("user_typing", {
        userId: socket.userId,
        isTyping: data.isTyping,
      });
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
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
