// server/src/routes/messages.js
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { requireAuth, getUserFromClerk } = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(requireAuth, getUserFromClerk);

// Get all conversations for the current user
router.get("/conversations", messageController.getConversations);

// Get messages for a specific conversation
router.get("/conversations/:conversationId", messageController.getMessages);

// Start a new conversation
router.post("/conversations", messageController.startConversation);

// Send a message in an existing conversation
router.post("/conversations/:conversationId", messageController.sendMessage);

// Mark messages in a conversation as read
router.put("/conversations/:conversationId/read", messageController.markAsRead);

module.exports = router;
