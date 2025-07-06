import React from 'react';
import { FileText, Upload, BarChart3, CheckCircle } from 'lucide-react';
import ResumeAnalyzer from '@/components/career/ResumeAnalyzer.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import type { ResumeAnalysis } from '@/types';

const ResumeAnalyzerPage: React.FC = () => {
  const handleAnalysisComplete = (analysis: ResumeAnalysis) => {
    console.log('Analysis completed:', analysis);
    // Could trigger notifications, analytics, etc.
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Resume Analyzer</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get detailed insights into your resume with our AI-powered analysis. 
          Identify strengths, weaknesses, and get actionable recommendations for improvement.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-6">
            <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-semibold">Easy Upload</p>
            <p className="text-sm text-muted-foreground">Drag & drop or browse files</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold">AI Analysis</p>
            <p className="text-sm text-muted-foreground">Advanced scoring algorithm</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="font-semibold">Detailed Feedback</p>
            <p className="text-sm text-muted-foreground">Actionable recommendations</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="font-semibold">Multiple Formats</p>
            <p className="text-sm text-muted-foreground">PDF, DOC, DOCX supported</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analyzer Component */}
      <div className="max-w-6xl mx-auto">
        <ResumeAnalyzer onAnalysisComplete={handleAnalysisComplete} />
      </div>

      {/* Information Section */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>What We Analyze</CardTitle>
            <CardDescription>Our comprehensive analysis covers all aspects of your resume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Content Quality</p>
                <p className="text-xs text-muted-foreground">
                  Writing quality, clarity, and professional language
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Skills Assessment</p>
                <p className="text-xs text-muted-foreground">
                  Technical and soft skills identification and relevance
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Format & Structure</p>
                <p className="text-xs text-muted-foreground">
                  Layout, organization, and visual appeal
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">ATS Compatibility</p>
                <p className="text-xs text-muted-foreground">
                  Applicant tracking system optimization
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Industry Alignment</p>
                <p className="text-xs text-muted-foreground">
                  Relevance to target roles and industries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Get the Best Results</CardTitle>
            <CardDescription>Tips for optimal resume analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Use a clean, well-formatted resume</p>
                <p className="text-xs text-muted-foreground">
                  Avoid images, complex layouts, or unusual fonts
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Include relevant keywords</p>
                <p className="text-xs text-muted-foreground">
                  Use industry-specific terms and skills
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Keep it concise and focused</p>
                <p className="text-xs text-muted-foreground">
                  1-2 pages with relevant information only
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Update with recent experiences</p>
                <p className="text-xs text-muted-foreground">
                  Include your latest roles and achievements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">Your privacy is protected</p>
              <p className="text-sm text-muted-foreground">
                All uploaded resumes are analyzed securely and automatically deleted after 30 days. 
                We never share your personal information with third parties.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeAnalyzerPage;