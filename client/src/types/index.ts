// TypeScript type definitions

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  averageSalary: number;
  growthRate: number;
  jobOutlook: 'excellent' | 'good' | 'fair' | 'poor';
  educationLevel: string;
  experienceRequired: string;
}

export interface ResumeAnalysis {
  id: string;
  userId: string;
  fileName: string;
  uploadedAt: string;
  analysis: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    skillsMatched: string[];
    missingSkills: string[];
  };
  status: 'processing' | 'completed' | 'error';
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'text' | 'boolean';
  question: string;
  options?: string[];
  correctAnswer?: string | boolean;
  points: number;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentId: string;
  score: number;
  totalPoints: number;
  answers: Record<string, any>;
  completedAt: string;
  timeTaken: number; // in minutes
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'user' | 'ai';
  metadata?: {
    suggestions?: string[];
    resources?: string[];
  };
}

export interface DashboardStats {
  totalAssessments: number;
  completedAssessments: number;
  averageScore: number;
  careerMatches: number;
  resumeAnalyses: number;
  skillsIdentified: number;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface FormData {
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// UI Component Props
export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
}

export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export interface TabsProps {
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}