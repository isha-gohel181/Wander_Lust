import React from "react";
import { formatTimeAgo } from "@/utils/helpers";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

const MessageList = ({ conversations, onSelectConversation, selectedId }) => {
  const { user } = useAuth();

  if (!conversations || conversations.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No conversations yet</p>
        <p className="text-sm mt-2">
          Start a conversation by contacting a host
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => {
        // Determine if the other person is a host or guest
        const isUserHost = user?._id === conversation?.property?.host?._id;
        const otherPerson = isUserHost
          ? conversation?.guest
          : conversation?.property?.host || {};
        const lastMessage = conversation.lastMessage;

        return (
          <div
            key={conversation._id}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedId === conversation._id ? "bg-gray-100" : ""
            }`}
            onClick={() => onSelectConversation(conversation._id)}
          >
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={otherPerson?.avatar} />
                <AvatarFallback>
                  {otherPerson?.firstName?.[0] || "?"}
                  {otherPerson?.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900 truncate">
                    {otherPerson?.firstName || "Unknown"}{" "}
                    {otherPerson?.lastName || "User"}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {lastMessage && formatTimeAgo(lastMessage.createdAt)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  {lastMessage?.content || "No messages yet"}
                </p>

                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500 truncate">
                    {conversation?.property?.title ||
                      "Property details unavailable"}
                  </span>

                  {conversation.unreadCount > 0 && (
                    <Badge
                      variant="default"
                      className="ml-2 text-xs bg-wanderlust-500"
                    >
                      {conversation.unreadCount} new
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
