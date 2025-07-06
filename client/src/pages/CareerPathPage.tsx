import React, { useState } from 'react';
import { Search, TrendingUp, Users, Award } from 'lucide-react';
import CareerPathForm from '@/components/career/CareerPathForm.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge';
import type { CareerPath } from '@/types';

const CareerPathPage: React.FC = () => {
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);

  const handleCareerSelect = (career: CareerPath) => {
    setSelectedCareer(career);
  };

  const handleBackToSearch = () => {
    setSelectedCareer(null);
  };

  // Career Detail View
  if (selectedCareer) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="outline" 
              onClick={handleBackToSearch}
              className="mb-4"
            >
              ← Back to Search
            </Button>
            <h1 className="text-3xl font-bold">{selectedCareer.title}</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Detailed career information and planning
            </p>
          </div>
        </div>

        {/* Career Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Career Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedCareer.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
                <CardDescription>
                  Skills needed to succeed in this career
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedCareer.requiredSkills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant={userSkills.includes(skill) ? "default" : "outline"}
                      className="justify-center p-2"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                {userSkills.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      You have {selectedCareer.requiredSkills.filter(skill => userSkills.includes(skill)).length} of {selectedCareer.requiredSkills.length} required skills!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Career Path & Growth</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">{selectedCareer.growthRate}%</p>
                    <p className="text-sm text-muted-foreground">Job Growth Rate</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold">{selectedCareer.jobOutlook}</p>
                    <p className="text-sm text-muted-foreground">Job Outlook</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-semibold">{selectedCareer.experienceRequired}</p>
                    <p className="text-sm text-muted-foreground">Experience Required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Salary</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${selectedCareer.averageSalary.toLocaleString()}/year
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Education Level</p>
                  <p className="font-medium">{selectedCareer.educationLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Experience Required</p>
                  <p className="font-medium">{selectedCareer.experienceRequired}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Job Outlook</p>
                  <Badge className={
                    selectedCareer.jobOutlook === 'excellent' ? 'bg-green-100 text-green-800' :
                    selectedCareer.jobOutlook === 'good' ? 'bg-blue-100 text-blue-800' :
                    selectedCareer.jobOutlook === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {selectedCareer.jobOutlook}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => window.open('/assessment', '_blank')}>
                  Take Skills Assessment
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.open('/resume-analyzer', '_blank')}>
                  Analyze My Resume
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.open('/chat', '_blank')}>
                  Get Career Advice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main Career Search View
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Explore Career Paths</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover career opportunities that match your skills, interests, and goals. 
          Get personalized recommendations based on your profile.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-6">
            <Search className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">500+</p>
            <p className="text-sm text-muted-foreground">Career Paths</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">95%</p>
            <p className="text-sm text-muted-foreground">Accuracy Rate</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">10K+</p>
            <p className="text-sm text-muted-foreground">Users Helped</p>
          </CardContent>
        </Card>
      </div>

      {/* Career Path Form */}
      <div className="max-w-6xl mx-auto">
        <CareerPathForm 
          onCareerSelect={handleCareerSelect}
          selectedSkills={userSkills}
        />
      </div>

      {/* How It Works */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">How It Works</CardTitle>
          <CardDescription className="text-center">
            Follow these simple steps to find your ideal career path
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold">Search & Filter</h3>
              <p className="text-sm text-muted-foreground">
                Search for careers by keywords or browse by categories. Use filters to narrow down options.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold">Get Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Based on your skills and assessments, we'll recommend careers that match your profile.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold">Plan Your Path</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed information about requirements, skills needed, and next steps for your chosen career.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerPathPage;