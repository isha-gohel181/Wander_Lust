import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  ApiResponse, 
  CareerPath, 
  ResumeAnalysis, 
  Assessment, 
  AssessmentResult, 
  ChatMessage, 
  DashboardStats 
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Career Paths
  async getCareerPaths(): Promise<CareerPath[]> {
    const response: AxiosResponse<ApiResponse<CareerPath[]>> = await this.api.get('/career-paths');
    return response.data.data || [];
  }

  async getCareerPath(id: string): Promise<CareerPath | null> {
    const response: AxiosResponse<ApiResponse<CareerPath>> = await this.api.get(`/career-paths/${id}`);
    return response.data.data || null;
  }

  async searchCareerPaths(query: string): Promise<CareerPath[]> {
    const response: AxiosResponse<ApiResponse<CareerPath[]>> = await this.api.get(`/career-paths/search?q=${encodeURIComponent(query)}`);
    return response.data.data || [];
  }

  async getCareerRecommendations(skills: string[]): Promise<CareerPath[]> {
    const response: AxiosResponse<ApiResponse<CareerPath[]>> = await this.api.post('/career-paths/recommendations', { skills });
    return response.data.data || [];
  }

  // Resume Analysis
  async uploadResume(file: File): Promise<ResumeAnalysis> {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response: AxiosResponse<ApiResponse<ResumeAnalysis>> = await this.api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to upload resume');
    }
    
    return response.data.data!;
  }

  async getResumeAnalysis(id: string): Promise<ResumeAnalysis | null> {
    const response: AxiosResponse<ApiResponse<ResumeAnalysis>> = await this.api.get(`/resume/analysis/${id}`);
    return response.data.data || null;
  }

  async getResumeAnalyses(): Promise<ResumeAnalysis[]> {
    const response: AxiosResponse<ApiResponse<ResumeAnalysis[]>> = await this.api.get('/resume/analyses');
    return response.data.data || [];
  }

  async deleteResumeAnalysis(id: string): Promise<void> {
    await this.api.delete(`/resume/analysis/${id}`);
  }

  // Assessments
  async getAssessments(): Promise<Assessment[]> {
    const response: AxiosResponse<ApiResponse<Assessment[]>> = await this.api.get('/assessments');
    return response.data.data || [];
  }

  async getAssessment(id: string): Promise<Assessment | null> {
    const response: AxiosResponse<ApiResponse<Assessment>> = await this.api.get(`/assessments/${id}`);
    return response.data.data || null;
  }

  async submitAssessment(assessmentId: string, answers: Record<string, any>): Promise<AssessmentResult> {
    const response: AxiosResponse<ApiResponse<AssessmentResult>> = await this.api.post(`/assessments/${assessmentId}/submit`, { answers });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to submit assessment');
    }
    
    return response.data.data!;
  }

  async getAssessmentResults(): Promise<AssessmentResult[]> {
    const response: AxiosResponse<ApiResponse<AssessmentResult[]>> = await this.api.get('/assessments/results');
    return response.data.data || [];
  }

  async getAssessmentResult(id: string): Promise<AssessmentResult | null> {
    const response: AxiosResponse<ApiResponse<AssessmentResult>> = await this.api.get(`/assessments/results/${id}`);
    return response.data.data || null;
  }

  // Chat
  async sendChatMessage(content: string): Promise<ChatMessage> {
    const response: AxiosResponse<ApiResponse<ChatMessage>> = await this.api.post('/chat/message', { content });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to send message');
    }
    
    return response.data.data!;
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    const response: AxiosResponse<ApiResponse<ChatMessage[]>> = await this.api.get('/chat/history');
    return response.data.data || [];
  }

  async clearChatHistory(): Promise<void> {
    await this.api.delete('/chat/history');
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response: AxiosResponse<ApiResponse<DashboardStats>> = await this.api.get('/dashboard/stats');
    return response.data.data || {
      totalAssessments: 0,
      completedAssessments: 0,
      averageScore: 0,
      careerMatches: 0,
      resumeAnalyses: 0,
      skillsIdentified: 0,
    };
  }

  // Generic API methods
  async get<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(endpoint);
    return response.data.data!;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(endpoint, data);
    return response.data.data!;
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.put(endpoint, data);
    return response.data.data!;
  }

  async delete(endpoint: string): Promise<void> {
    await this.api.delete(endpoint);
  }
}

// Create and export the API service instance
export const apiService = new ApiService();
export default apiService;