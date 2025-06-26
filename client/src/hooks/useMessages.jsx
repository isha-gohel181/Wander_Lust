//client/src/hooks/useMessages.js
import { useState, useEffect, useCallback, useRef } from "react";
import { messageService } from "@/services/messages";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";
import {
  initializeSocket,
  getSocket,
  joinConversation,
  leaveConversation,
  sendMessage as emitSocketMessage,
  sendTypingStatus,
} from "@/services/socket";

export const useMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [usersTyping, setUsersTyping] = useState({});
  const [socketConnected, setSocketConnected] = useState(false);

  // Keep track of the current conversation ID
  const currentConversationRef = useRef(null);

  // Initialize socket when user is available
  useEffect(() => {
    const setupSocket = async () => {
      if (user) {
        try {
          // Get token from Clerk
          const token = await window.Clerk?.session?.getToken();
          if (token) {
            await initializeSocket(token);
            setSocketConnected(true);

            // Get socket instance
            const socket = getSocket();

            // Set up socket event listeners
            if (socket) {
              // Handle receiving a new message
              socket.on("receive_message", (newMessage) => {
                // If this message belongs to the current conversation, add it to messages
                if (
                  newMessage.conversation === currentConversationRef.current
                ) {
                  setMessages((prev) => [...prev, newMessage]);
                }

                // Update conversations list with the new message
                setConversations((prev) => {
                  return prev.map((conv) => {
                    if (conv._id === newMessage.conversation) {
                      // Update unread count if this is not the current conversation
                      const newUnreadCount =
                        conv._id === currentConversationRef.current
                          ? conv.unreadCount
                          : (conv.unreadCount || 0) + 1;

                      return {
                        ...conv,
                        lastMessage: {
                          content: newMessage.content,
                          createdAt: newMessage.createdAt,
                        },
                        unreadCount: newUnreadCount,
                      };
                    }
                    return conv;
                  });
                });

                // Update global unread count
                if (
                  newMessage.conversation !== currentConversationRef.current
                ) {
                  setUnreadCount((prev) => prev + 1);
                }
              });

              // Handle typing indicators
              socket.on("user_typing", (data) => {
                if (data.conversationId === currentConversationRef.current) {
                  setUsersTyping((prev) => ({
                    ...prev,
                    [data.userId]: data.isTyping,
                  }));

                  // Auto-clear typing indicator after 3 seconds of inactivity
                  if (data.isTyping) {
                    setTimeout(() => {
                      setUsersTyping((prev) => ({
                        ...prev,
                        [data.userId]: false,
                      }));
                    }, 3000);
                  }
                }
              });

              // Handle new message notifications
              socket.on("new_message_notification", (data) => {
                // Only show notification if we're not already in this conversation
                if (data.conversationId !== currentConversationRef.current) {
                  toast.custom(
                    (t) => (
                      <div
                        className={`max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 ${
                          t.visible ? "animate-enter" : "animate-leave"
                        }`}
                      >
                        <div className="flex-1 p-4">
                          <div className="flex items-start">
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                New message from {data.sender.name}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                {data.message}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex border-l border-gray-200">
                          <button
                            onClick={() => {
                              toast.dismiss(t.id);
                              fetchMessages(data.conversationId);
                            }}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ),
                    { duration: 5000 }
                  );

                  // Update unread count for the conversation
                  setConversations((prev) => {
                    return prev.map((conv) => {
                      if (conv._id === data.conversationId) {
                        return {
                          ...conv,
                          unreadCount: (conv.unreadCount || 0) + 1,
                        };
                      }
                      return conv;
                    });
                  });

                  // Update global unread count
                  setUnreadCount((prev) => prev + 1);
                }
              });
            }
          }
        } catch (err) {
          console.error("Socket initialization failed:", err);
        }
      }
    };

    setupSocket();

    return () => {
      // If the current conversation is set, leave it when unmounting
      if (currentConversationRef.current) {
        leaveConversation(currentConversationRef.current);
      }
    };
  }, [user]);

  // Fetch all conversations for the current user
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await messageService.getConversations();
      setConversations(data);

      // Calculate unread message count
      const unread = data.reduce(
        (count, conv) => count + (conv.unreadCount || 0),
        0
      );
      setUnreadCount(unread);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(
    async (conversationId) => {
      if (!conversationId) return;

      // Leave previous conversation if exists
      if (
        currentConversationRef.current &&
        currentConversationRef.current !== conversationId
      ) {
        leaveConversation(currentConversationRef.current);
      }

      // Join new conversation
      joinConversation(conversationId);
      currentConversationRef.current = conversationId;

      setLoading(true);
      try {
        const data = await messageService.getMessages(conversationId);
        setMessages(data);

        // Find and set the current conversation
        const conversation = conversations.find(
          (c) => c._id === conversationId
        );
        setCurrentConversation(conversation);

        // Mark messages as read
        if (conversation?.unreadCount > 0) {
          await messageService.markAsRead(conversationId);
          // Update unread count locally
          setConversations((prev) =>
            prev.map((c) =>
              c._id === conversationId ? { ...c, unreadCount: 0 } : c
            )
          );
          setUnreadCount((prev) =>
            Math.max(0, prev - conversation.unreadCount)
          );
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    },
    [conversations]
  );

  // Start a new conversation with a host about a property
  const startConversation = async (hostId, propertyId, initialMessage) => {
    setLoading(true);
    try {
      const newConversation = await messageService.startConversation({
        recipient: hostId,
        propertyId,
        message: initialMessage,
      });

      // Add new conversation to the list and set it as current
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setMessages(newConversation.messages || []);

      // Join the new conversation socket room
      joinConversation(newConversation._id);
      currentConversationRef.current = newConversation._id;

      toast.success("Message sent to host");
      return newConversation;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Send a message in the current conversation
  const sendMessage = async (conversationId, messageText) => {
    try {
      // Optimistically add message to UI
      const tempMessage = {
        _id: Date.now().toString(), // Temporary ID
        conversation: conversationId,
        sender: user._id,
        content: messageText,
        createdAt: new Date().toISOString(),
        isTemp: true, // Flag to identify this as a temporary message
      };

      setMessages((prev) => [...prev, tempMessage]);

      // Get recipient ID (the other person in the conversation)
      const conversation = conversations.find((c) => c._id === conversationId);
      const recipientId =
        conversation?.host?._id === user._id
          ? conversation?.guest?._id
          : conversation?.host?._id;

      // Emit socket event
      emitSocketMessage({
        conversationId,
        content: messageText,
        recipientId,
      });

      // Also save to database via API
      const newMessage = await messageService.sendMessage(
        conversationId,
        messageText
      );

      // Replace temp message with the real one
      setMessages((prev) => prev.map((msg) => (msg.isTemp ? newMessage : msg)));

      // Update conversation with new last message
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId
            ? {
                ...c,
                lastMessage: {
                  content: messageText,
                  createdAt: new Date().toISOString(),
                },
              }
            : c
        )
      );

      return newMessage;
    } catch (err) {
      toast.error("Failed to send message");
      setError(err.message);

      // Remove the temp message on error
      setMessages((prev) => prev.filter((msg) => !msg.isTemp));
      return null;
    }
  };

  // Handle typing status
  const handleTyping = (conversationId, isTyping) => {
    sendTypingStatus(conversationId, isTyping);
  };

  // Load conversations on initial render
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    unreadCount,
    usersTyping,
    socketConnected,
    fetchConversations,
    fetchMessages,
    startConversation,
    sendMessage,
    setCurrentConversation,
    handleTyping,
  };
};
