// client/src/components/assistant/FloatingAssistantWidget.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  Send,
  ExternalLink,
  Bot,
  User,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { assistantService } from "@/services/assistant";

const QUICK_CHIPS = [
  "Find Properties",
  "Booking Help",
  "Cancellation Policy",
  "Travel Recommendations",
];

const renderInline = (str) => {
  const parts = str.split(/(\*\*\*.+?\*\*\*|\*\*.+?\*\*|\*.+?\*|`.+?`)/);
  return parts.map((part, i) => {
    if (/^\*\*\*.+\*\*\*$/.test(part)) {
      return <strong key={i}><em>{part.slice(3, -3)}</em></strong>;
    }
    if (/^\*\*.+\*\*$/.test(part)) {
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    if (/^\*.+\*$/.test(part)) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (/^`.+`$/.test(part)) {
      return <code key={i} className="rounded bg-orange-50 px-1 py-0.5 text-xs font-mono text-wanderlust-700">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const renderMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split(/\n/);
  return lines.map((line, idx) => (
    <p key={idx} className="text-xs sm:text-sm leading-relaxed mb-1">
      {renderInline(line)}
    </p>
  ));
};

export default function FloatingAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Wander AI. Ask me anything about stays, bookings, or destinations.",
    },
  ]);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || query).trim();
    if (!text || loading) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setQuery("");

    try {
      const data = await assistantService.ask(text);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "I could not generate an answer.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error?.message || "Something went wrong while generating response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="relative group flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-wanderlust-600 to-wanderlust-500 hover:from-wanderlust-700 hover:to-wanderlust-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-wanderlust-300"
          aria-label="Open Wander AI Assistant"
        >
          <Bot className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-7 rounded-full bg-white shadow-md">
            <span className="text-[9px] font-bold text-wanderlust-600 tracking-tight">AI</span>
          </div>
          <div className="absolute right-16 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            Ask Wander AI
          </div>
        </button>
      )}

      {/* Chat Widget Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-gray-200 w-[360px] sm:w-[400px] flex flex-col transition-all duration-300 transform ${
            isMinimized ? "h-16 overflow-hidden" : "h-[540px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-wanderlust-600 to-wanderlust-500 text-white rounded-t-2xl">
            <div className="flex items-center space-x-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                <Bot className="h-4 w-4 text-white" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-400 border-2 border-wanderlust-600 rounded-full"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">Wander AI</h3>
                <p className="text-[10px] text-white/80">Online & ready to help</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => navigate("/assistant")}
                title="Open Full Assistant Page"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Restore" : "Minimize"}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start space-x-2.5 ${
                      msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                        msg.role === "user"
                          ? "bg-gray-900 text-white"
                          : "bg-wanderlust-100 text-wanderlust-700"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="h-3.5 w-3.5" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div
                      className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm shadow-sm ${
                        msg.role === "user"
                          ? "bg-wanderlust-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                      }`}
                    >
                      {renderMarkdown(msg.content)}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center space-x-2 text-gray-400 text-xs py-1">
                    <div className="w-2 h-2 bg-wanderlust-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-wanderlust-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-wanderlust-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    <span>Wander AI is thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              {messages.length <= 2 && (
                <div className="px-3 py-2 bg-white border-t border-gray-100 flex flex-wrap gap-1.5">
                  {QUICK_CHIPS.map((chip, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(chip)}
                      className="text-xs bg-orange-50 hover:bg-orange-100 text-wanderlust-700 px-2.5 py-1 rounded-full transition-colors border border-orange-100 font-medium"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-gray-200 rounded-b-2xl">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Wander AI anything..."
                    className="flex-1 px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wanderlust-500 focus:bg-white text-gray-900"
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={loading || !query.trim()}
                    size="sm"
                    className="bg-wanderlust-500 hover:bg-wanderlust-600 text-white rounded-xl px-3.5 h-9"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
