export type MatchStatus = 'MATCHED' | 'PARTIALLY_MATCHED' | 'NOT_EVIDENCED';

export interface ExtractedRequirement {
  id: string;
  category: 'required_skill' | 'preferred_skill' | 'qualification' | 'experience' | 'responsibility';
  text: string;
  importance: 'high' | 'medium' | 'low';
}

export interface EvidenceItem {
  record_type: 'skill' | 'project' | 'experience' | 'education' | 'certification' | 'achievement';
  record_id: string;
  record_title: string;
  matched_text: string;
  relevance_explanation: string;
}

export interface RequirementMatch {
  requirement_id: string;
  requirement_text: string;
  category: 'required_skill' | 'preferred_skill' | 'qualification' | 'experience' | 'responsibility';
  status: MatchStatus;
  confidence_score: number; // 0 to 100
  evidence: EvidenceItem[];
  rationale: string;
}

export interface JobAnalysisResult {
  job_title: string;
  company_name?: string;
  location?: string;
  role_summary: string;
  required_skills: string[];
  preferred_skills: string[];
  qualifications: string[];
  experience_requirements: string[];
  responsibilities: string[];
  keywords: string[];
  requirements: ExtractedRequirement[];
  matches: RequirementMatch[];
  overall_match_score: number; // 0 to 100
  analysis_mode: 'gemini_ai' | 'deterministic_fallback';
  model_used?: string;
  suggested_tailored_summary?: string;
}

export interface SavedJobAnalysis {
  id: string;
  title: string;
  company?: string;
  raw_job_description: string;
  analysis_result: JobAnalysisResult;
  created_at: string;
  updated_at: string;
}
