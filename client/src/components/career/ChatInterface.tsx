import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Trash2, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api.ts';
import { formatDate } from '@/lib/utils.ts';
import type { ChatMessage } from '@/types';

interface ChatInterfaceProps {
  onMessageSent?: (message: ChatMessage) => void;
  placeholder?: string;
  title?: string;
  description?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onMessageSent,
  placeholder = "Ask me anything about your career...",
  title = "Career Assistant",
  description = "Get personalized career advice and guidance"
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const history = await apiService.getChatHistory();
      setMessages(history);
    } catch (err) {
      console.error('Failed to load chat history:', err);
      // Initialize with welcome message if no history
      setMessages([{
        id: 'welcome',
        senderId: 'ai',
        content: "Hello! I'm your career assistant. I can help you with career planning, job search advice, skill development, and more. What would you like to know?",
        timestamp: new Date().toISOString(),
        type: 'ai',
        metadata: {
          suggestions: [
            "What career paths match my skills?",
            "How can I improve my resume?",
            "What skills are in demand?",
            "How do I prepare for job interviews?"
          ]
        }
      }]);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      senderId: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await apiService.sendChatMessage(userMessage.content);
      setMessages(prev => [...prev, aiResponse]);
      onMessageSent?.(aiResponse);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await apiService.clearChatHistory();
      setMessages([{
        id: 'welcome',
        senderId: 'ai',
        content: "Chat cleared! How can I help you today?",
        timestamp: new Date().toISOString(),
        type: 'ai'
      }]);
    } catch (err) {
      setError('Failed to clear chat');
    }
  };

  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const MessageComponent = ({ message }: { message: ChatMessage }) => {
    const isUser = message.type === 'user';
    const isCopied = copiedMessageId === message.id;

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-primary text-primary-foreground ml-2' : 'bg-secondary text-secondary-foreground mr-2'
          }`}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>

          {/* Message Content */}
          <div className={`rounded-lg p-3 ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground'
          }`}>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>

            {/* Message Actions */}
            <div className="flex items-center justify-between mt-2 text-xs opacity-70">
              <span>{formatDate(message.timestamp)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyMessage(message.content, message.id)}
                className="h-6 w-6 p-0 hover:bg-transparent"
              >
                {isCopied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>

            {/* AI Suggestions */}
            {!isUser && message.metadata?.suggestions && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {message.metadata.suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs h-6 px-2"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Resources */}
            {!isUser && message.metadata?.resources && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium">Helpful resources:</p>
                <div className="space-y-1">
                  {message.metadata.resources.map((resource, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Header */}
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>{title}</span>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadChatHistory}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation to get career guidance!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mr-2">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4 flex-shrink-0">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;