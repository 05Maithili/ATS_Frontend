/**
 * API Client for connecting frontend to backend
 * All API calls go through this module
 */

// Use relative URLs to leverage Vite proxy, or fallback to environment variable
const API_BASE_URL = "https://ats-backend-1-tdue.onrender.com";
console.log("API BASE URL:", API_BASE_URL);
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage
    this.token = localStorage.getItem("access_token");
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${this.baseUrl}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (this.token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
  }
  try {
    const response = await fetch(url, { ...options, headers });

    // Handle 204 No Content (DELETE success)
    if (response.status === 204) {
      return { data: undefined as any, status: 204 };
    }

    let data: any = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (e) {
        // Ignore JSON parsing errors; we'll treat as no data
      }
    }

    if (!response.ok) {
      return {
        error: data?.detail || "An error occurred",
        status: response.status,
      };
    }

    return { data, status: response.status };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }
}
  // ============== Auth Endpoints ==============

  async login(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.detail || "Login failed", status: response.status };
    }

    this.setToken(data.access_token);
    return { data, status: response.status };
  }

  async register(email: string, username: string, password: string, fullName?: string) {
    return this.request<{ id: number; email: string; username: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        username,
        password,
        full_name: fullName,
      }),
    });
  }

  async getCurrentUser() {
    return this.request<{
      id: number;
      email: string;
      username: string;
      full_name: string | null;
      is_active: boolean;
    }>("/api/auth/me");
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem("user");
  }

  // ============== Resume Endpoints ==============

  async getResumes() {
    return this.request<Resume[]>("/api/resumes");
  }

  async getResume(id: number) {
    return this.request<Resume>(`/api/resumes/${id}`);
  }

  async createResume(resume: {
    filename: string;
    file_content: string;
    skills?: string;
    experience_years?: number;
  }) {
    return this.request<Resume>("/api/resumes", {
      method: "POST",
      body: JSON.stringify(resume),
    });
  }

  async deleteResume(id: number) {
    return this.request<void>(`/api/resumes/${id}`, {
      method: "DELETE",
    });
  }

  // Add to ApiClient class
async deleteAnalysis(id: number) {
  return this.request<void>(`/api/analyses/${id}`, {
    method: "DELETE",
  });
}

  // ============== Job Description Endpoints ==============

  async getJobDescriptions() {
    return this.request<JobDescription[]>("/api/job-descriptions");
  }

  async createJobDescription(jd: {
    title: string;
    company?: string;
    description: string;
    requirements?: string;
  }) {
    return this.request<JobDescription>("/api/job-descriptions", {
      method: "POST",
      body: JSON.stringify(jd),
    });
  }

  // ============== Analysis Endpoints ==============

  
  async getAnalyses() {
  const response = await this.request<Analysis[]>("/api/analyses");

  if (response.data) {
    response.data = response.data.map((analysis) => ({
      ...analysis,
      gaps: typeof analysis.gaps === 'string' ? JSON.parse(analysis.gaps) : (analysis.gaps || []),
      matches: typeof analysis.matches === 'string' ? JSON.parse(analysis.matches) : (analysis.matches || []),
      recommendations: typeof analysis.recommendations === 'string' 
        ? JSON.parse(analysis.recommendations) 
        : (analysis.recommendations || []),
    }));
  }

  return response;
}

  async createAnalysis(analysis: {
    resume_id: number;
    job_description_id: number;
    ats_score: number;
    keyword_coverage?: number;
    skill_overlap?: number;
    semantic_alignment?: number;
    formatting_score?: number;
    gaps?: string;
    matches?: string;
    recommendations?: string;
  }) {
    return this.request<Analysis>("/api/analyses", {
      method: "POST",
      body: JSON.stringify(analysis),
    });
  }

  // In api.ts, replace the analyzeResume method

async analyzeResume(resumeText: string, jobDescription: string) {
  const formData = new URLSearchParams();
  formData.append("resume_text", resumeText);
  formData.append("job_description", jobDescription);

  const headers: HeadersInit = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (this.token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
  }

  try {
    console.log("Sending analysis request...");
    const response = await fetch(`${this.baseUrl}/api/analyze`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();
    console.log("Analysis response:", data);

    if (!response.ok) {
      return { 
        error: data.detail || "Analysis failed", 
        status: response.status,
        data: null 
      };
    }

    return { data, status: response.status, error: null };
  } catch (err) {
    console.error("Network error in analyzeResume:", err);
    const errorMessage = err instanceof Error ? err.message : "Network error";
    return { error: errorMessage, status: 0, data: null };
  }
}
  // ============== Health Check ==============

  async healthCheck() {
    return this.request<{ status: string }>("/api/health");
  }
}

// ============== Type Definitions ==============

export interface Resume {
  id: number;
  filename: string;
  file_path: string;
  file_content: string | null;
  skills: string | null;
  experience_years: number | null;
  created_at: string;
}

export interface JobDescription {
  id: number;
  title: string;
  company: string | null;
  description: string;
  requirements: string | null;
  created_at: string;
}

export interface Analysis {
  id: number;
  ats_score: number;
  keyword_coverage: number | null;
  skill_overlap: number | null;
  semantic_alignment: number | null;
  formatting_score: number | null;
  gaps: string | null;
  matches: string | null;
  recommendations: string | null;
  created_at: string;
  resume?: Resume;
  job_description?: JobDescription;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

// Analysis result from /api/analyze endpoint
export interface AnalyzeResult {
  success: boolean;
  ats_score: number;
  subscores: {
    keyword_coverage?: number;
    skill_overlap?: number;
    semantic_alignment?: number;
    formatting?: number;
  };
  gaps: Array<{
    skill: string;
    impact: string;
  }>;
  matches: Array<{
    requirement: string;
    matched_bullet: string;
    score: number;
  }>;
  resume_text: string;
  jd_requirements: string[];
}

// ============== Export Instance ==============

export const api = new ApiClient(API_BASE_URL);
export default api;



