// client/src/components/messages/MessageChat.jsx

import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { formatTime } from "@/utils/helpers";

const MessageChat = ({
  conversation,
  messages,
  onSendMessage,
  loading,
  usersTyping,
  onTyping,
}) => {
  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    if (!conversation) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    onTyping(conversation._id, true);

    typingTimeoutRef.current = setTimeout(() => {
      onTyping(conversation._id, false);
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim() || loading) return;

    onSendMessage(conversation._id, messageText);
    setMessageText("");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    onTyping(conversation._id, false);
  };

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="mb-2">Select a conversation</p>
          <p className="text-sm">or start a new one by contacting a host</p>
        </div>
      </div>
    );
  }

  const isUserHost = user?._id === conversation.property?.host?._id;
  const otherPerson = isUserHost
    ? conversation.guest
    : conversation.property?.host;

  if (!otherPerson) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Unable to load user information.
      </div>
    );
  }

  const isOtherPersonTyping = usersTyping && usersTyping[otherPerson._id];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between bg-white">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={otherPerson?.avatar || "/default-avatar.png"}
              alt="User Avatar"
            />
            <AvatarFallback>
              {otherPerson?.firstName?.[0] || ""}
              {otherPerson?.lastName?.[0] || ""}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">
              {otherPerson?.firstName} {otherPerson?.lastName}
            </h3>
            <p className="text-xs text-gray-500">
              {isUserHost ? "Guest" : "Host"} • {conversation.property?.title}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet</p>
            <p className="text-sm mt-2">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.sender === user?._id;
            return (
              <div
                key={message._id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-end space-x-2 max-w-[75%]">
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={otherPerson?.avatar || "/default-avatar.png"}
                      />
                      <AvatarFallback>
                        {otherPerson?.firstName?.[0] || ""}
                        {otherPerson?.lastName?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isCurrentUser
                        ? "bg-wanderlust-500 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span
                      className={`text-xs block text-right mt-1 ${
                        isCurrentUser ? "text-wanderlust-100" : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isOtherPersonTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={otherPerson?.avatar || "/default-avatar.png"}
                />
                <AvatarFallback>
                  {otherPerson?.firstName?.[0] || ""}
                  {otherPerson?.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-200">
                <div className="typing-indicator flex gap-1">
                  <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t bg-white">
        <div className="flex space-x-2">
          <Input
            value={messageText}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="flex-1"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={!messageText.trim() || loading}
            className="bg-wanderlust-500 hover:bg-wanderlust-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageChat;
