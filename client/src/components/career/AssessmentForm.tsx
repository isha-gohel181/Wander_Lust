import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Award, BarChart3, Play, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { apiService } from '@/services/api.ts';
import { formatDuration } from '@/lib/utils.ts';
import type { Assessment, AssessmentQuestion, AssessmentResult } from '@/types';

interface AssessmentFormProps {
  assessmentId?: string;
  onComplete?: (result: AssessmentResult) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ assessmentId, onComplete }) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    if (assessmentId) {
      loadSpecificAssessment(assessmentId);
    }
  }, [assessmentId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !isCompleted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, isCompleted, timeRemaining]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const assessmentList = await apiService.getAssessments();
      setAssessments(assessmentList);
    } catch (err) {
      setError('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const loadSpecificAssessment = async (id: string) => {
    try {
      const assessment = await apiService.getAssessment(id);
      if (assessment) {
        setSelectedAssessment(assessment);
      }
    } catch (err) {
      setError('Failed to load assessment');
    }
  };

  const startAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setIsStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(assessment.duration * 60);
    setStartTime(new Date());
    setError(null);
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (selectedAssessment && currentQuestionIndex < selectedAssessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!selectedAssessment || !startTime) return;

    try {
      setLoading(true);
      const timeTaken = Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60));
      const assessmentResult = await apiService.submitAssessment(selectedAssessment.id, answers);
      
      setResult(assessmentResult);
      setIsCompleted(true);
      onComplete?.(assessmentResult);
    } catch (err) {
      setError('Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setSelectedAssessment(null);
    setIsStarted(false);
    setIsCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(0);
    setResult(null);
    setStartTime(null);
    setError(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const QuestionComponent = ({ question, answer, onChange }: {
    question: AssessmentQuestion;
    answer: any;
    onChange: (value: any) => void;
  }) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answer === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'boolean':
        return (
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                checked={answer === true}
                onChange={() => onChange(true)}
                className="w-4 h-4 text-primary"
              />
              <span>True</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                checked={answer === false}
                onChange={() => onChange(false)}
                className="w-4 h-4 text-primary"
              />
              <span>False</span>
            </label>
          </div>
        );

      case 'text':
        return (
          <Textarea
            value={answer || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[120px]"
          />
        );

      default:
        return null;
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={resetAssessment}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Assessment Results
  if (isCompleted && result) {
    const percentage = (result.score / result.totalPoints) * 100;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <Award className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Assessment Completed!</CardTitle>
            <CardDescription>
              You've successfully completed the {selectedAssessment?.title} assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(result.score, result.totalPoints)}`}>
                {result.score}/{result.totalPoints}
              </div>
              <div className="text-2xl font-semibold mt-2">
                {percentage.toFixed(1)}%
              </div>
              <Progress value={percentage} className="w-full mt-4" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-muted-foreground">
                  {formatDuration(result.timeTaken)}
                </div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">
                  {selectedAssessment?.questions.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={resetAssessment} variant="outline">
                Take Another Assessment
              </Button>
              <Button onClick={() => window.print()}>
                Download Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assessment in Progress
  if (isStarted && selectedAssessment) {
    const currentQuestion = selectedAssessment.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100;

    return (
      <div className="space-y-6">
        {/* Progress Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Badge variant="outline">
                  Question {currentQuestionIndex + 1} of {selectedAssessment.questions.length}
                </Badge>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className={timeRemaining < 300 ? 'text-red-600 font-bold' : ''}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
              <Button variant="outline" onClick={resetAssessment}>
                Exit Assessment
              </Button>
            </div>
            <Progress value={progress} className="w-full" />
          </CardContent>
        </Card>

        {/* Current Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestion.question}
            </CardTitle>
            <CardDescription>
              {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <QuestionComponent
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            />

            <div className="flex justify-between">
              <Button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                Previous
              </Button>
              
              {currentQuestionIndex === selectedAssessment.questions.length - 1 ? (
                <Button
                  onClick={handleSubmitAssessment}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Submitting...' : 'Submit Assessment'}
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={!answers[currentQuestion.id]}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assessment Selection
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Assessments</CardTitle>
          <CardDescription>
            Choose an assessment to test your knowledge and skills
          </CardDescription>
        </CardHeader>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{assessment.title}</span>
                  <Badge className={getDifficultyColor(assessment.difficulty)}>
                    {assessment.difficulty}
                  </Badge>
                </CardTitle>
                <CardDescription>{assessment.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>{formatDuration(assessment.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                    <span>{assessment.questions.length} questions</span>
                  </div>
                </div>
                
                <div>
                  <Badge variant="outline">{assessment.category}</Badge>
                </div>

                <Button
                  onClick={() => startAssessment(assessment)}
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {assessments.length === 0 && !loading && (
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">No assessments available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssessmentForm;