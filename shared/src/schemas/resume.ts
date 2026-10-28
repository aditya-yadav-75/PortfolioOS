import { z } from 'zod';

export const SelectedResumeItemSchema = z.object({
  id: z.string(),
  item_id: z.string(),
  section_type: z.enum([
    'summary',
    'experience',
    'projects',
    'skills',
    'education',
    'certifications',
    'achievements',
    'publications',
  ]),
  order_index: z.number().int().min(0),
  is_included: z.boolean(),
  custom_title: z.string().optional(),
  custom_bullets: z.array(z.string()).optional(),
});

export const ResumeTypographyConfigSchema = z.object({
  font_family: z.enum(['sans', 'serif']),
  font_size: z.enum(['compact', 'normal', 'relaxed']),
  spacing: z.enum(['compact', 'standard', 'spacious']),
  accent_color: z.string(),
  paper_tone: z.enum(['white', 'warm_white']),
});

export const ResumeDocumentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Resume name is required').max(100),
  target_role: z.string().min(1, 'Target role is required').max(100),
  target_company: z.string().max(100).optional().or(z.literal('')),
  template: z.enum(['classic_ats', 'modern_professional']),
  typography: ResumeTypographyConfigSchema,
  professional_summary: z.string().max(3000),
  section_order: z.array(
    z.enum([
      'summary',
      'experience',
      'projects',
      'skills',
      'education',
      'certifications',
      'achievements',
      'publications',
    ])
  ),
  selected_skills: z.array(z.string()),
  selected_projects: z.array(SelectedResumeItemSchema),
  selected_experience: z.array(SelectedResumeItemSchema),
  selected_education: z.array(SelectedResumeItemSchema),
  selected_certifications: z.array(SelectedResumeItemSchema),
  selected_achievements: z.array(SelectedResumeItemSchema),
});
