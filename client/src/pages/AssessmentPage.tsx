import React from 'react';
import { BookOpen, Clock, Award, TrendingUp, Target, Users } from 'lucide-react';
import AssessmentForm from '@/components/career/AssessmentForm.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge';
import type { AssessmentResult } from '@/types';

const AssessmentPage: React.FC = () => {
  const handleAssessmentComplete = (result: AssessmentResult) => {
    console.log('Assessment completed:', result);
    // Could trigger celebrations, analytics, recommendations, etc.
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Skills Assessments</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Test your knowledge and skills with our comprehensive assessments. 
          Get detailed results and personalized recommendations for career growth.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-6">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-semibold">Identify Skills</p>
            <p className="text-sm text-muted-foreground">Discover your strengths and areas for improvement</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold">Track Progress</p>
            <p className="text-sm text-muted-foreground">Monitor your learning journey over time</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="font-semibold">Get Certified</p>
            <p className="text-sm text-muted-foreground">Earn certificates for completed assessments</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Assessment Component */}
      <div className="max-w-6xl mx-auto">
        <AssessmentForm onComplete={handleAssessmentComplete} />
      </div>

      {/* Assessment Types */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Types of Assessments</CardTitle>
            <CardDescription className="text-center">
              Choose from various assessment categories based on your career goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-semibold mb-2">Technical Skills</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Programming languages, software tools, and technical concepts
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">JavaScript</Badge>
                  <Badge variant="outline" className="text-xs">Python</Badge>
                  <Badge variant="outline" className="text-xs">Data Analysis</Badge>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <Users className="h-6 w-6 text-green-600 mb-2" />
                <h3 className="font-semibold mb-2">Soft Skills</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Communication, leadership, and interpersonal abilities
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Leadership</Badge>
                  <Badge variant="outline" className="text-xs">Communication</Badge>
                  <Badge variant="outline" className="text-xs">Teamwork</Badge>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <Target className="h-6 w-6 text-purple-600 mb-2" />
                <h3 className="font-semibold mb-2">Industry Knowledge</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Domain-specific knowledge and industry best practices
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Marketing</Badge>
                  <Badge variant="outline" className="text-xs">Finance</Badge>
                  <Badge variant="outline" className="text-xs">Healthcare</Badge>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <Award className="h-6 w-6 text-orange-600 mb-2" />
                <h3 className="font-semibold mb-2">Cognitive Abilities</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Problem-solving, critical thinking, and analytical skills
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Logic</Badge>
                  <Badge variant="outline" className="text-xs">Analysis</Badge>
                  <Badge variant="outline" className="text-xs">Reasoning</Badge>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <Clock className="h-6 w-6 text-red-600 mb-2" />
                <h3 className="font-semibold mb-2">Quick Assessments</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Short 5-10 minute assessments for specific skills
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">5 min</Badge>
                  <Badge variant="outline" className="text-xs">Quick Test</Badge>
                  <Badge variant="outline" className="text-xs">Focused</Badge>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <TrendingUp className="h-6 w-6 text-indigo-600 mb-2" />
                <h3 className="font-semibold mb-2">Comprehensive</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  In-depth assessments covering multiple skill areas
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">30-60 min</Badge>
                  <Badge variant="outline" className="text-xs">Detailed</Badge>
                  <Badge variant="outline" className="text-xs">Multi-skill</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How Assessments Work */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">How Assessments Work</CardTitle>
            <CardDescription className="text-center">
              Follow these steps to complete your assessment and get valuable insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold">Choose Assessment</h3>
                <p className="text-sm text-muted-foreground">
                  Select an assessment that matches your career goals or interests
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold">Take the Test</h3>
                <p className="text-sm text-muted-foreground">
                  Answer questions at your own pace within the time limit
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold">Get Results</h3>
                <p className="text-sm text-muted-foreground">
                  Receive detailed scores and performance analysis instantly
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                  4
                </div>
                <h3 className="font-semibold">Improve Skills</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized recommendations for skill development
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Tips */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Tips</CardTitle>
            <CardDescription>Maximize your assessment performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Manage your time wisely</p>
                <p className="text-xs text-muted-foreground">
                  Keep track of remaining time and pace yourself accordingly
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BookOpen className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Read questions carefully</p>
                <p className="text-xs text-muted-foreground">
                  Take time to understand what each question is asking
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Answer honestly</p>
                <p className="text-xs text-muted-foreground">
                  Honest answers provide the most accurate results
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Award className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Stay focused</p>
                <p className="text-xs text-muted-foreground">
                  Find a quiet environment free from distractions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>After Your Assessment</CardTitle>
            <CardDescription>What happens next</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">View detailed results</p>
                <p className="text-xs text-muted-foreground">
                  See your score breakdown and performance metrics
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Get recommendations</p>
                <p className="text-xs text-muted-foreground">
                  Receive personalized career and learning suggestions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Award className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Earn certificates</p>
                <p className="text-xs text-muted-foreground">
                  Download certificates for successful completions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Track progress</p>
                <p className="text-xs text-muted-foreground">
                  Monitor your improvement over time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentPage;