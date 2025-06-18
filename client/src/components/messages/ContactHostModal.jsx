// client/src/components/messages/ContactHostModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessages } from "@/hooks/useMessages";
import { useNavigate } from "react-router-dom";

const ContactHostModal = ({ host, property, onClose }) => {
  const [message, setMessage] = useState("");
  const { startConversation, loading } = useMessages();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "" || loading) return;

    const conversation = await startConversation(
      host._id,
      property._id,
      message
    );
    if (conversation) {
      onClose();
      navigate("/messages");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Contact Host</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={host.avatar} />
              <AvatarFallback>
                {host.firstName?.[0]}
                {host.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-gray-900">
                {host.firstName} {host.lastName}
              </h4>
              <p className="text-sm text-gray-600">Host</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Send a message to {host.firstName} about {property.title}
          </p>

          <form onSubmit={handleSubmit}>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi ${host.firstName}, I'm interested in your property...`}
              rows={5}
              required
              className="mb-4"
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!message.trim() || loading}
                className="bg-wanderlust-500 hover:bg-wanderlust-600"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactHostModal;
