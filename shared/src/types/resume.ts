export type ResumeTemplateType = 'classic_ats' | 'modern_professional';

export type ResumeSectionType =
  | 'summary'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'education'
  | 'certifications'
  | 'achievements'
  | 'publications';

export interface ResumeTypographyConfig {
  font_family: 'sans' | 'serif';
  font_size: 'compact' | 'normal' | 'relaxed';
  spacing: 'compact' | 'standard' | 'spacious';
  accent_color: string; // e.g. '#0284C7' or '#1E293B'
  paper_tone: 'white' | 'warm_white'; // '#FFFFFF' or '#FDFDFD'
}

export interface SelectedResumeItem {
  id: string;
  item_id: string;
  section_type: ResumeSectionType;
  order_index: number;
  is_included: boolean;
  custom_title?: string;
  custom_bullets?: string[];
}

export interface ResumeDocument {
  id: string;
  name: string;
  target_role: string;
  target_company?: string;
  template: ResumeTemplateType;
  typography: ResumeTypographyConfig;
  professional_summary: string;
  section_order: ResumeSectionType[];
  selected_skills: string[]; // skill IDs
  selected_projects: SelectedResumeItem[];
  selected_experience: SelectedResumeItem[];
  selected_education: SelectedResumeItem[];
  selected_certifications: SelectedResumeItem[];
  selected_achievements: SelectedResumeItem[];
  created_at: string;
  updated_at: string;
}

export interface ResumeVersionSummary {
  id: string;
  name: string;
  target_role: string;
  template: ResumeTemplateType;
  created_at: string;
  updated_at: string;
}
