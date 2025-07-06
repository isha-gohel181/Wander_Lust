import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, DollarSign, GraduationCap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress.tsx';
import { apiService } from '@/services/api.ts';
import { formatPrice } from '@/lib/utils.ts';
import type { CareerPath } from '@/types';

interface CareerPathFormProps {
  onCareerSelect?: (career: CareerPath) => void;
  selectedSkills?: string[];
}

const CareerPathForm: React.FC<CareerPathFormProps> = ({ 
  onCareerSelect, 
  selectedSkills = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [recommendations, setRecommendations] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCareerPaths();
  }, []);

  useEffect(() => {
    if (selectedSkills.length > 0) {
      loadRecommendations();
    }
  }, [selectedSkills]);

  const loadCareerPaths = async () => {
    try {
      setLoading(true);
      const paths = await apiService.getCareerPaths();
      setCareerPaths(paths);
    } catch (err) {
      setError('Failed to load career paths');
      console.error('Error loading career paths:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const recs = await apiService.getCareerRecommendations(selectedSkills);
      setRecommendations(recs);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadCareerPaths();
      return;
    }

    try {
      setLoading(true);
      const results = await apiService.searchCareerPaths(searchTerm);
      setCareerPaths(results);
    } catch (err) {
      setError('Failed to search career paths');
      console.error('Error searching career paths:', err);
    } finally {
      setLoading(false);
    }
  };

  const getJobOutlookColor = (outlook: string) => {
    switch (outlook) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CareerCard = ({ career }: { career: CareerPath }) => (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onCareerSelect?.(career)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{career.title}</span>
          <Badge className={getJobOutlookColor(career.jobOutlook)}>
            {career.jobOutlook}
          </Badge>
        </CardTitle>
        <CardDescription>{career.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm">{formatPrice(career.averageSalary)}/year</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{career.growthRate}% growth</span>
          </div>
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4 text-purple-600" />
            <span className="text-sm">{career.educationLevel}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-sm">{career.experienceRequired}</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Required Skills:</h4>
          <div className="flex flex-wrap gap-1">
            {career.requiredSkills.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {career.requiredSkills.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{career.requiredSkills.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        {selectedSkills.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Skill Match:</h4>
            <Progress 
              value={(career.requiredSkills.filter(skill => selectedSkills.includes(skill)).length / career.requiredSkills.length) * 100} 
              className="w-full" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {career.requiredSkills.filter(skill => selectedSkills.includes(skill)).length} of {career.requiredSkills.length} skills matched
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadCareerPaths}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex space-x-2">
        <Input
          placeholder="Search career paths..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Recommended for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((career) => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>
        </div>
      )}

      {/* All Career Paths */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {searchTerm ? 'Search Results' : 'All Career Paths'}
        </h3>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : careerPaths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {careerPaths.map((career) => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No career paths found for your search.' : 'No career paths available.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CareerPathForm;