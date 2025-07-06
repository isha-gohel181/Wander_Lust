import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  FileText, 
  Target,
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  Calendar,
  PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { apiService } from '@/services/api.ts';
import { formatDate, formatPercentage, getScoreColor } from '@/lib/utils.ts';
import type { DashboardStats, AssessmentResult, ResumeAnalysis, CareerPath } from '@/types';

interface UserDashboardProps {
  onNavigate?: (path: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAssessments, setRecentAssessments] = useState<AssessmentResult[]>([]);
  const [recentAnalyses, setRecentAnalyses] = useState<ResumeAnalysis[]>([]);
  const [recommendations, setRecommendations] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardStats, assessmentResults, resumeAnalyses] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getAssessmentResults(),
        apiService.getResumeAnalyses()
      ]);

      setStats(dashboardStats);
      setRecentAssessments(assessmentResults.slice(0, 5));
      setRecentAnalyses(resumeAnalyses.slice(0, 3));

      // Get recommendations if we have skills from recent analyses
      if (resumeAnalyses.length > 0) {
        const latestAnalysis = resumeAnalyses[0];
        if (latestAnalysis.analysis?.skillsMatched) {
          const careerRecs = await apiService.getCareerRecommendations(
            latestAnalysis.analysis.skillsMatched
          );
          setRecommendations(careerRecs.slice(0, 3));
        }
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    color = 'blue',
    trend,
    onClick 
  }: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    trend?: string;
    onClick?: () => void;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white',
      red: 'bg-red-500 text-white'
    };

    return (
      <Card className={`cursor-pointer hover:shadow-lg transition-shadow ${onClick ? 'hover:border-primary' : ''}`} onClick={onClick}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold">{value}</p>
                {trend && (
                  <Badge variant="outline" className="text-xs">
                    {trend}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const QuickActions = () => (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Jump into your career development journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={() => onNavigate?.('/assessment')}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Take Assessment
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={() => onNavigate?.('/resume-analyzer')}
        >
          <FileText className="h-4 w-4 mr-2" />
          Analyze Resume
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={() => onNavigate?.('/career-path')}
        >
          <Target className="h-4 w-4 mr-2" />
          Explore Careers
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={() => onNavigate?.('/chat')}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Career Chat
        </Button>
      </CardContent>
    </Card>
  );

  const RecentActivity = () => (
    <Card>
      <CardHeader>
        <CardTitle>Recent Assessments</CardTitle>
        <CardDescription>Your latest assessment results</CardDescription>
      </CardHeader>
      <CardContent>
        {recentAssessments.length === 0 ? (
          <div className="text-center py-6">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No assessments completed yet</p>
            <Button 
              className="mt-3" 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate?.('/assessment')}
            >
              Take Your First Assessment
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAssessments.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Assessment #{result.id.slice(-6)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(result.completedAt)}
                    </p>
                  </div>
                </div>
                <Badge className={getScoreColor(result.score) + ' bg-opacity-10'}>
                  {formatPercentage((result.score / result.totalPoints) * 100)}
                </Badge>
              </div>
            ))}
            {recentAssessments.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onNavigate?.('/assessment')}
              >
                View All Results
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const ResumeInsights = () => (
    <Card>
      <CardHeader>
        <CardTitle>Resume Insights</CardTitle>
        <CardDescription>Latest resume analysis results</CardDescription>
      </CardHeader>
      <CardContent>
        {recentAnalyses.length === 0 ? (
          <div className="text-center py-6">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No resume analyses yet</p>
            <Button 
              className="mt-3" 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate?.('/resume-analyzer')}
            >
              Upload Your Resume
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{analysis.fileName}</p>
                  <Badge className={getScoreColor(analysis.analysis.score) + ' bg-opacity-10'}>
                    {analysis.analysis.score}/100
                  </Badge>
                </div>
                <Progress value={analysis.analysis.score} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">
                  {analysis.analysis.skillsMatched.length} skills identified
                </p>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => onNavigate?.('/resume-analyzer')}
            >
              View All Analyses
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const CareerRecommendations = () => (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Careers</CardTitle>
        <CardDescription>Based on your skills and interests</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-6">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Complete assessments to get recommendations</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((career) => (
              <div key={career.id} className="p-3 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{career.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {career.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {career.jobOutlook}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatPercentage(career.growthRate)}% growth
                      </span>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-600 ml-2" />
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => onNavigate?.('/career-path')}
            >
              Explore All Careers
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadDashboardData}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assessments Taken"
          value={stats?.totalAssessments || 0}
          description="Total assessments completed"
          icon={BookOpen}
          color="blue"
          onClick={() => onNavigate?.('/assessment')}
        />
        <StatCard
          title="Average Score"
          value={`${stats?.averageScore || 0}%`}
          description="Across all assessments"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Skills Identified"
          value={stats?.skillsIdentified || 0}
          description="From resume analysis"
          icon={Star}
          color="purple"
          onClick={() => onNavigate?.('/resume-analyzer')}
        />
        <StatCard
          title="Career Matches"
          value={stats?.careerMatches || 0}
          description="Recommended career paths"
          icon={Target}
          color="orange"
          onClick={() => onNavigate?.('/career-path')}
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <QuickActions />
            <RecentActivity />
            <ResumeInsights />
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Progress</CardTitle>
                <CardDescription>Your learning journey over time</CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.completedAssessments && stats?.totalAssessments ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span>{stats.completedAssessments}/{stats.totalAssessments}</span>
                    </div>
                    <Progress 
                      value={(stats.completedAssessments / stats.totalAssessments) * 100} 
                      className="w-full" 
                    />
                    <p className="text-xs text-muted-foreground">
                      {formatPercentage((stats.completedAssessments / stats.totalAssessments) * 100)} completion rate
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No progress data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAssessments.slice(0, 3).map((result) => (
                    <div key={result.id} className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm">Completed assessment</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(result.completedAt)}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {formatPercentage((result.score / result.totalPoints) * 100)}
                      </Badge>
                    </div>
                  ))}
                  {recentAnalyses.slice(0, 2).map((analysis) => (
                    <div key={analysis.id} className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm">Uploaded resume</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(analysis.uploadedAt)}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {analysis.analysis.score}/100
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CareerRecommendations />
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>Recommended actions for career growth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Complete more assessments</p>
                    <p className="text-xs text-muted-foreground">
                      Take specialized assessments to get better recommendations
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Update your resume</p>
                    <p className="text-xs text-muted-foreground">
                      Improve your resume based on analysis feedback
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Explore career paths</p>
                    <p className="text-xs text-muted-foreground">
                      Research recommended careers in detail
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;