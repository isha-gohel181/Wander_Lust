// server/src/controllers/messageController.js
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Property = require("../models/Property");
const User = require("../models/User");
const { getIO } = require("../config/socket"); // <-- Socket.io integration

// Get all conversations for the current user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      $or: [{ host: userId }, { guest: userId }],
    })
      .populate({
        path: "property",
        select: "title images location host",
        populate: {
          path: "host",
          select: "firstName lastName avatar",
        },
      })
      .populate("guest", "firstName lastName avatar")
      .populate("host", "firstName lastName avatar")
      .populate("lastMessage", "content createdAt")
      .sort({ updatedAt: -1 });

    const formattedConversations = conversations.map((conversation) => {
      const isHost = conversation.host._id.toString() === userId.toString();
      const unreadCount = isHost
        ? conversation.unreadByHost
        : conversation.unreadByGuest;

      return {
        _id: conversation._id,
        property: conversation.property,
        guest: conversation.guest,
        host: conversation.host,
        lastMessage: conversation.lastMessage,
        unreadCount,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      };
    });

    res.status(200).json(formattedConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get messages for a specific conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      $or: [{ host: userId }, { guest: userId }],
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages = await Message.find({ conversation: conversationId }).sort({
      createdAt: 1,
    });

    const isHost = conversation.host.toString() === userId.toString();
    if (isHost && conversation.unreadByHost > 0) {
      await Conversation.findByIdAndUpdate(conversationId, { unreadByHost: 0 });
      await Message.updateMany(
        {
          conversation: conversationId,
          sender: { $ne: userId },
          isRead: false,
        },
        { isRead: true }
      );
    } else if (!isHost && conversation.unreadByGuest > 0) {
      await Conversation.findByIdAndUpdate(conversationId, {
        unreadByGuest: 0,
      });
      await Message.updateMany(
        {
          conversation: conversationId,
          sender: { $ne: userId },
          isRead: false,
        },
        { isRead: true }
      );
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: error.message });
  }
};

// Start a new conversation
exports.startConversation = async (req, res) => {
  try {
    const { recipient, propertyId, message } = req.body;
    const userId = req.user._id;
    const io = getIO();

    if (!recipient || !propertyId || !message) {
      return res
        .status(400)
        .json({
          message:
            "Recipient ID, property ID, and message content are required",
        });
    }

    const property = await Property.findById(propertyId).populate(
      "host",
      "firstName lastName avatar"
    );
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    let hostId, guestId;
    if (property.host._id.toString() === userId.toString()) {
      hostId = userId;
      guestId = recipient;
    } else {
      hostId = recipient;
      guestId = userId;
    }

    let conversation = await Conversation.findOne({
      property: propertyId,
      host: hostId,
      guest: guestId,
    });
    if (!conversation) {
      conversation = await Conversation.create({
        property: propertyId,
        host: hostId,
        guest: guestId,
      });
    }

    const newMessage = await Message.create({
      conversation: conversation._id,
      sender: userId,
      content: message,
    });

    const isHost = userId.toString() === hostId.toString();
    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: newMessage._id,
      ...(isHost
        ? { unreadByGuest: conversation.unreadByGuest + 1 }
        : { unreadByHost: conversation.unreadByHost + 1 }),
    });

    const populatedMessage = await Message.findById(newMessage._id).populate(
      "sender",
      "firstName lastName avatar"
    );

    const updatedConversation = await Conversation.findById(conversation._id)
      .populate("property", "title images location host")
      .populate("guest", "firstName lastName avatar")
      .populate("host", "firstName lastName avatar")
      .populate("lastMessage", "content createdAt");

    // Real-time emit
    io.to(`conversation:${conversation._id}`).emit(
      "receive_message",
      populatedMessage
    );
    io.to(`user:${hostId}`).emit("new_conversation", updatedConversation);
    io.to(`user:${guestId}`).emit("new_conversation", updatedConversation);

    res.status(201).json({
      ...updatedConversation.toObject(),
      messages: [populatedMessage],
      unreadCount: 0,
    });
  } catch (error) {
    console.error("Error starting conversation:", error);
    res.status(500).json({ message: error.message });
  }
};

// Send a message in an existing conversation
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;
    const io = getIO();

    if (!message) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      $or: [{ host: userId }, { guest: userId }],
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const newMessage = await Message.create({
      conversation: conversationId,
      sender: userId,
      content: message,
    });

    const isHost = conversation.host.toString() === userId.toString();
    const recipientId = isHost
      ? conversation.guest.toString()
      : conversation.host.toString();

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
      ...(isHost
        ? { unreadByGuest: conversation.unreadByGuest + 1 }
        : { unreadByHost: conversation.unreadByHost + 1 }),
    });

    const populatedMessage = await Message.findById(newMessage._id).populate(
      "sender",
      "firstName lastName avatar"
    );

    // Real-time emit
    io.to(`conversation:${conversationId}`).emit(
      "receive_message",
      populatedMessage
    );
    io.to(`user:${recipientId}`).emit("new_message_notification", {
      conversationId,
      message: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
      sender: {
        _id: userId,
        name: req.user.firstName,
      },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mark all messages in a conversation as read
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      $or: [{ host: userId }, { guest: userId }],
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isHost = conversation.host.toString() === userId.toString();
    if (isHost) {
      await Conversation.findByIdAndUpdate(conversationId, { unreadByHost: 0 });
    } else {
      await Conversation.findByIdAndUpdate(conversationId, {
        unreadByGuest: 0,
      });
    }

    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: userId }, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: error.message });
  }
};
