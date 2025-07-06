import React from 'react';
import { MessageCircle, Bot, Zap, BookOpen, Target, Users } from 'lucide-react';
import ChatInterface from '@/components/career/ChatInterface.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge';
import type { ChatMessage } from '@/types';

const ChatPage: React.FC = () => {
  const handleMessageSent = (message: ChatMessage) => {
    console.log('Message sent:', message);
    // Could trigger analytics, notifications, etc.
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Career Assistant</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get instant, personalized career advice from our AI assistant. 
          Ask questions about career planning, job search, skills, and more.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-4">
            <Zap className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="font-semibold text-sm">Instant Answers</p>
            <p className="text-xs text-muted-foreground">Get responses in seconds</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Bot className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-sm">AI-Powered</p>
            <p className="text-xs text-muted-foreground">Advanced career intelligence</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="font-semibold text-sm">Personalized</p>
            <p className="text-xs text-muted-foreground">Tailored to your profile</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <MessageCircle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="font-semibold text-sm">24/7 Available</p>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Interface */}
      <div className="max-w-4xl mx-auto">
        <ChatInterface 
          onMessageSent={handleMessageSent}
          title="Career Assistant"
          description="Ask me anything about your career journey"
          placeholder="Type your career question here..."
        />
      </div>

      {/* Popular Questions */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Popular Questions</CardTitle>
            <CardDescription className="text-center">
              Common career questions our AI assistant can help you with
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-600" />
                  Career Planning
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• "What career paths match my skills?"</p>
                  <p>• "How do I choose the right career?"</p>
                  <p>• "What are the highest paying jobs in tech?"</p>
                  <p>• "How can I transition to a new career?"</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                  Skill Development
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• "What skills should I learn for my career?"</p>
                  <p>• "How to improve my communication skills?"</p>
                  <p>• "Which programming languages to learn?"</p>
                  <p>• "How to develop leadership skills?"</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <Users className="h-4 w-4 mr-2 text-purple-600" />
                  Job Search
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• "How to write a compelling resume?"</p>
                  <p>• "How to prepare for job interviews?"</p>
                  <p>• "Where to find job opportunities?"</p>
                  <p>• "How to negotiate salary?"</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <Bot className="h-4 w-4 mr-2 text-orange-600" />
                  Industry Insights
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• "What are the trends in my industry?"</p>
                  <p>• "How is AI affecting jobs?"</p>
                  <p>• "What are remote work opportunities?"</p>
                  <p>• "Which industries are growing fastest?"</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Features */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Smart Features</CardTitle>
            <CardDescription>Advanced capabilities of our career assistant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Bot className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Contextual Understanding</p>
                <p className="text-xs text-muted-foreground">
                  Remembers your conversation history and provides relevant follow-up suggestions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Personalized Recommendations</p>
                <p className="text-xs text-muted-foreground">
                  Tailors advice based on your skills, experience, and career goals
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BookOpen className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Resource Suggestions</p>
                <p className="text-xs text-muted-foreground">
                  Provides relevant articles, courses, and tools for your queries
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Zap className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Quick Actions</p>
                <p className="text-xs text-muted-foreground">
                  Suggests relevant assessments, resume analysis, or career exploration
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
            <CardDescription>Tips for getting the most out of your chat session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Be specific with your questions</p>
                <p className="text-xs text-muted-foreground">
                  Detailed questions help provide more accurate and useful responses
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Share your background</p>
                <p className="text-xs text-muted-foreground">
                  Mention your experience level, industry, and goals for better advice
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Ask follow-up questions</p>
                <p className="text-xs text-muted-foreground">
                  Dive deeper into topics that interest you or need clarification
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BookOpen className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Save important responses</p>
                <p className="text-xs text-muted-foreground">
                  Copy or bookmark valuable advice for future reference
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Example Conversations */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Example Conversations</CardTitle>
            <CardDescription className="text-center">
              See how our AI assistant can help with different types of career questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <Badge className="mb-3" variant="outline">Career Change</Badge>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">"I'm a teacher wanting to move into tech"</p>
                  <p className="text-muted-foreground">
                    Get advice on transferable skills, learning paths, and transition strategies
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <Badge className="mb-3" variant="outline">Skill Assessment</Badge>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">"What skills do I need for data science?"</p>
                  <p className="text-muted-foreground">
                    Learn about required technical skills, tools, and learning resources
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <Badge className="mb-3" variant="outline">Interview Prep</Badge>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">"How to prepare for a product manager interview?"</p>
                  <p className="text-muted-foreground">
                    Get tips on common questions, preparation strategies, and what to expect
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;