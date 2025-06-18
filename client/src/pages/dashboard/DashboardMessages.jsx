// client/src/pages/dashboard/DashboardMessages.jsx
import React from "react";
import { MessageSquare } from "lucide-react";
import MessageList from "@/components/messages/MessageList";
import MessageChat from "@/components/messages/MessageChat";
import { useMessages } from "@/hooks/useMessages";

const DashboardMessages = () => {
  const {
    conversations,
    messages,
    loading,
    currentConversation,
    usersTyping,
    fetchMessages,
    sendMessage,
    handleTyping,
  } = useMessages();

  const handleSelectConversation = (conversationId) => {
    fetchMessages(conversationId);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="h-6 w-6 mr-2" />
          Messages
        </h1>
        <p className="text-gray-600">Manage your conversations with guests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
        {/* Conversations List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
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
                selectedId={currentConversation?._id}
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
  );
};

export default DashboardMessages;
