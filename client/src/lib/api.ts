import {
  CompletePortfolio,
  PortfolioProfile,
  Education,
  Skill,
  Certification,
  Project,
  Experience,
  Achievement,
  Publication,
  Language,
  JobAnalysisResult,
  SavedJobAnalysis,
  ResumeDocument,
  ResumeVersionSummary,
  SheetsIntegrationStatus,
  SheetsSyncLog,
} from '@portfolio-os/shared';

const BASE_URL = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMsg = `Request failed: ${res.statusText}`;
    try {
      const errData = await res.json();
      if (errData.error) errorMsg = errData.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Portfolio
  portfolio: {
    getComplete: () => request<CompletePortfolio>('/portfolio'),
    getProfile: () => request<PortfolioProfile | null>('/portfolio/profile'),
    updateProfile: (data: Partial<PortfolioProfile>) => request<PortfolioProfile>('/portfolio/profile', { method: 'PUT', body: JSON.stringify(data) }),
    
    // Education
    getEducation: () => request<Education[]>('/portfolio/education'),
    addEducation: (data: any) => request<Education>('/portfolio/education', { method: 'POST', body: JSON.stringify(data) }),
    updateEducation: (id: string, data: any) => request<Education>(`/portfolio/education/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteEducation: (id: string) => request<{ success: boolean }>(`/portfolio/education/${id}`, { method: 'DELETE' }),

    // Skills
    getSkills: () => request<Skill[]>('/portfolio/skills'),
    addSkill: (data: any) => request<Skill>('/portfolio/skills', { method: 'POST', body: JSON.stringify(data) }),
    updateSkill: (id: string, data: any) => request<Skill>(`/portfolio/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteSkill: (id: string) => request<{ success: boolean }>(`/portfolio/skills/${id}`, { method: 'DELETE' }),

    // Certifications
    getCertifications: () => request<Certification[]>('/portfolio/certifications'),
    addCertification: (data: any) => request<Certification>('/portfolio/certifications', { method: 'POST', body: JSON.stringify(data) }),
    updateCertification: (id: string, data: any) => request<Certification>(`/portfolio/certifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCertification: (id: string) => request<{ success: boolean }>(`/portfolio/certifications/${id}`, { method: 'DELETE' }),

    // Projects
    getProjects: () => request<Project[]>('/portfolio/projects'),
    addProject: (data: any) => request<Project>('/portfolio/projects', { method: 'POST', body: JSON.stringify(data) }),
    updateProject: (id: string, data: any) => request<Project>(`/portfolio/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProject: (id: string) => request<{ success: boolean }>(`/portfolio/projects/${id}`, { method: 'DELETE' }),

    // Experience
    getExperience: () => request<Experience[]>('/portfolio/experience'),
    addExperience: (data: any) => request<Experience>('/portfolio/experience', { method: 'POST', body: JSON.stringify(data) }),
    updateExperience: (id: string, data: any) => request<Experience>(`/portfolio/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteExperience: (id: string) => request<{ success: boolean }>(`/portfolio/experience/${id}`, { method: 'DELETE' }),

    // Achievements
    getAchievements: () => request<Achievement[]>('/portfolio/achievements'),
    addAchievement: (data: any) => request<Achievement>('/portfolio/achievements', { method: 'POST', body: JSON.stringify(data) }),
    deleteAchievement: (id: string) => request<{ success: boolean }>(`/portfolio/achievements/${id}`, { method: 'DELETE' }),

    // Publications
    getPublications: () => request<Publication[]>('/portfolio/publications'),
    addPublication: (data: any) => request<Publication>('/portfolio/publications', { method: 'POST', body: JSON.stringify(data) }),
    deletePublication: (id: string) => request<{ success: boolean }>(`/portfolio/publications/${id}`, { method: 'DELETE' }),

    // Languages
    getLanguages: () => request<Language[]>('/portfolio/languages'),
    addLanguage: (data: any) => request<Language>('/portfolio/languages', { method: 'POST', body: JSON.stringify(data) }),
    deleteLanguage: (id: string) => request<{ success: boolean }>(`/portfolio/languages/${id}`, { method: 'DELETE' }),

    // Import/Export
    importJson: (data: CompletePortfolio) => request<{ success: boolean }>('/portfolio/import/json', { method: 'POST', body: JSON.stringify(data) }),
    getExportUrl: () => `${BASE_URL}/portfolio/export/json`,
  },

  // Job Matcher & AI
  jobs: {
    analyze: (body: { job_description: string; job_title?: string; company_name?: string; save_analysis?: boolean }) =>
      request<JobAnalysisResult & { saved_analysis_id?: string }>('/jobs/analyze', { method: 'POST', body: JSON.stringify(body) }),
    rewriteSummary: (body: { current_summary: string; job_title: string; target_keywords?: string[]; key_achievements?: string[] }) =>
      request<{ rewritten_summary: string }>('/jobs/rewrite-summary', { method: 'POST', body: JSON.stringify(body) }),
    rewriteBullet: (body: { bullet: string; role?: string; target_skill_or_keyword?: string }) =>
      request<{ rewritten_bullet: string }>('/jobs/rewrite-bullet', { method: 'POST', body: JSON.stringify(body) }),
    getSavedAnalyses: () => request<SavedJobAnalysis[]>('/jobs/saved'),
    getAnalysisById: (id: string) => request<SavedJobAnalysis>(`/jobs/saved/${id}`),
    deleteAnalysis: (id: string) => request<{ success: boolean }>(`/jobs/saved/${id}`, { method: 'DELETE' }),
  },

  // Resumes
  resumes: {
    getAll: () => request<ResumeVersionSummary[]>('/resumes'),
    getById: (id: string) => request<ResumeDocument>(`/resumes/${id}`),
    create: (data: any) => request<ResumeDocument>('/resumes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<ResumeDocument>(`/resumes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<{ success: boolean }>(`/resumes/${id}`, { method: 'DELETE' }),
    generateTailored: (target_role: 'frontend' | 'ai_ml' | 'general') =>
      request<ResumeDocument>('/resumes/generate-tailored', { method: 'POST', body: JSON.stringify({ target_role }) }),
    getPdfDownloadUrl: (id: string) => `${BASE_URL}/resumes/${id}/pdf`,
  },

  // Google Sheets
  sheets: {
    getStatus: () => request<SheetsIntegrationStatus>('/sheets/status'),
    getLogs: () => request<SheetsSyncLog[]>('/sheets/logs'),
    export: (spreadsheet_id?: string) => request<{ success: boolean; itemsSynced: number; message: string }>('/sheets/export', { method: 'POST', body: JSON.stringify({ spreadsheet_id }) }),
    import: (spreadsheet_id?: string) => request<{ success: boolean; importedPortfolio: any; message: string }>('/sheets/import', { method: 'POST', body: JSON.stringify({ spreadsheet_id }) }),
  },

  // Settings
  settings: {
    getStatus: () => request<any>('/settings/status'),
    seedDemo: () => request<{ success: boolean; message: string }>('/settings/seed', { method: 'POST' }),
    resetDatabase: () => request<{ success: boolean; message: string }>('/settings/reset', { method: 'POST' }),
  },
};
