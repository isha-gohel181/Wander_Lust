// client/src/pages/Messages.jsx
import React, { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import MessageList from "@/components/messages/MessageList";
import MessageChat from "@/components/messages/MessageChat";
import { useMessages } from "@/hooks/useMessages";
import { useLocation } from "react-router-dom";

const Messages = () => {
  const location = useLocation();
  const {
    conversations,
    messages,
    loading,
    currentConversation,
    usersTyping,
    fetchMessages,
    sendMessage,
    fetchConversations,
    handleTyping,
  } = useMessages();
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // Handle conversation selection
  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    fetchMessages(conversationId);
  };

  // Check if there's a conversationId in the URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const conversationId = params.get("conversation");
    if (conversationId) {
      setSelectedConversationId(conversationId);
      fetchMessages(conversationId);
    }
  }, [location.search, fetchMessages]);

  // Refresh conversations periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations();
      if (selectedConversationId) {
        fetchMessages(selectedConversationId);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchConversations, fetchMessages, selectedConversationId]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            Messages
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden lg:col-span-1">
            <div className="border-b px-4 py-3">
              <h2 className="font-medium text-gray-900">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-49px)]">
              {loading && conversations.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <p>Loading conversations...</p>
                </div>
              ) : (
                <MessageList
                  conversations={conversations}
                  onSelectConversation={handleSelectConversation}
                  selectedId={selectedConversationId}
                />
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden lg:col-span-2 h-full">
            <MessageChat
              conversation={currentConversation}
              messages={messages}
              onSendMessage={sendMessage}
              loading={loading}
              usersTyping={usersTyping}
              onTyping={handleTyping}
            />
          </div>
        </div>
      </div>
    </div>
    
  );
  
};

export default Messages;
