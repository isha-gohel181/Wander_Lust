import React from 'react';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';
import UserDashboard from '@/components/dashboard/UserDashboard.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';

const DashboardPage: React.FC = () => {
  const handleNavigate = (path: string) => {
    // In a real app, this would use React Router
    window.location.href = path;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Career Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Track your progress and manage your career development journey
          </p>
        </div>
      </div>

      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-blue-900">Welcome to Your Career Dashboard!</h2>
              <p className="text-blue-700 mt-1">
                Your central hub for tracking progress, viewing insights, and planning your next career moves.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Component */}
      <UserDashboard onNavigate={handleNavigate} />

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Getting Started
            </CardTitle>
            <CardDescription>New to the platform? Here's how to begin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-sm">Complete your first assessment</p>
                <p className="text-xs text-muted-foreground">
                  Take a skills assessment to get personalized recommendations
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-sm">Upload and analyze your resume</p>
                <p className="text-xs text-muted-foreground">
                  Get detailed feedback and improvement suggestions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-sm">Explore career paths</p>
                <p className="text-xs text-muted-foreground">
                  Discover careers that match your skills and interests
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <p className="font-medium text-sm">Chat with career assistant</p>
                <p className="text-xs text-muted-foreground">
                  Get personalized advice and guidance anytime
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-600" />
              Success Tips
            </CardTitle>
            <CardDescription>Maximize your career development potential</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Set clear goals</p>
                <p className="text-xs text-muted-foreground">
                  Define specific, measurable career objectives to track progress
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Regular skill assessment</p>
                <p className="text-xs text-muted-foreground">
                  Take assessments quarterly to monitor skill development
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Award className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Continuous learning</p>
                <p className="text-xs text-muted-foreground">
                  Stay updated with industry trends and new technologies
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BarChart3 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Track your progress</p>
                <p className="text-xs text-muted-foreground">
                  Review dashboard regularly to celebrate achievements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="max-w-2xl mx-auto text-center">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2">Ready to Advance Your Career?</h3>
          <p className="text-muted-foreground mb-4">
            Use the tools above to explore opportunities, assess your skills, and plan your next steps.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => handleNavigate('/assessment')}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Take Assessment
            </button>
            <button 
              onClick={() => handleNavigate('/career-path')}
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-6 py-2 rounded-md transition-colors"
            >
              Explore Careers
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;