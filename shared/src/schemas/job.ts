import { z } from 'zod';

export const AnalyzeJobRequestSchema = z.object({
  job_description: z.string().min(20, 'Job description must be at least 20 characters long'),
  job_title: z.string().optional(),
  company_name: z.string().optional(),
});

export const RequirementMatchSchema = z.object({
  requirement_id: z.string(),
  requirement_text: z.string(),
  category: z.enum(['required_skill', 'preferred_skill', 'qualification', 'experience', 'responsibility']),
  status: z.enum(['MATCHED', 'PARTIALLY_MATCHED', 'NOT_EVIDENCED']),
  confidence_score: z.number().min(0).max(100),
  evidence: z.array(z.object({
    record_type: z.enum(['skill', 'project', 'experience', 'education', 'certification', 'achievement']),
    record_id: z.string(),
    record_title: z.string(),
    matched_text: z.string(),
    relevance_explanation: z.string(),
  })),
  rationale: z.string(),
});

export const ExtractedRequirementSchema = z.object({
  id: z.string(),
  category: z.enum(['required_skill', 'preferred_skill', 'qualification', 'experience', 'responsibility']),
  text: z.string(),
  importance: z.enum(['high', 'medium', 'low']),
});

export const JobAnalysisOutputSchema = z.object({
  job_title: z.string(),
  company_name: z.string().optional(),
  location: z.string().optional(),
  role_summary: z.string(),
  required_skills: z.array(z.string()),
  preferred_skills: z.array(z.string()),
  qualifications: z.array(z.string()),
  experience_requirements: z.array(z.string()),
  responsibilities: z.array(z.string()),
  keywords: z.array(z.string()),
  requirements: z.array(ExtractedRequirementSchema),
  matches: z.array(RequirementMatchSchema),
  overall_match_score: z.number().min(0).max(100),
  analysis_mode: z.enum(['gemini_ai', 'deterministic_fallback']),
  model_used: z.string().optional(),
  suggested_tailored_summary: z.string().optional(),
});

export const RewriteSummaryRequestSchema = z.object({
  current_summary: z.string().min(5),
  job_title: z.string(),
  target_keywords: z.array(z.string()).default([]),
  key_achievements: z.array(z.string()).default([]),
});

export const RewriteProjectBulletRequestSchema = z.object({
  bullet: z.string().min(5),
  role: z.string().optional(),
  target_skill_or_keyword: z.string().optional(),
});
