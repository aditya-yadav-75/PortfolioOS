import { z } from 'zod';

export const PortfolioProfileSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(1, 'Full name is required').max(100),
  headline: z.string().min(1, 'Professional headline is required').max(150),
  email: z.string().email('Valid email is required'),
  phone: z.string().max(30).optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  website_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(2000),
  career_objective: z.string().max(1000).optional().or(z.literal('')),
});

export const EducationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, 'Institution is required').max(150),
  degree: z.string().min(1, 'Degree is required').max(100),
  field_of_study: z.string().min(1, 'Field of study is required').max(100),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().or(z.literal('')),
  is_current: z.boolean().default(false),
  gpa: z.string().max(20).optional().or(z.literal('')),
  honors: z.string().max(150).optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  description: z.string().max(1000).optional().or(z.literal('')),
});

export const SkillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Skill name is required').max(80),
  category: z.enum([
    'Languages',
    'Frameworks & Libraries',
    'Databases & Cloud',
    'Tools & DevOps',
    'Core Concepts',
    'Soft Skills',
  ]),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  years_experience: z.number().min(0).max(50).optional(),
});

export const CertificationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(150),
  issuer: z.string().min(1, 'Issuer is required').max(150),
  issue_date: z.string().min(1, 'Issue date is required'),
  expiration_date: z.string().optional().or(z.literal('')),
  credential_id: z.string().max(100).optional().or(z.literal('')),
  credential_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export const ProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Project title is required').max(150),
  subtitle: z.string().max(150).optional().or(z.literal('')),
  role: z.string().max(100).optional().or(z.literal('')),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  bullet_points: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  github_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  live_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

export const ExperienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company is required').max(150),
  role: z.string().min(1, 'Role is required').max(100),
  location: z.string().max(100).optional().or(z.literal('')),
  employment_type: z.enum(['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance']),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().or(z.literal('')),
  is_current: z.boolean().default(false),
  description: z.string().min(5, 'Description is required').max(2000),
  bullet_points: z.array(z.string()).default([]),
  technologies: z.array(z.string()).optional().default([]),
});

export const AchievementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(150),
  issuer: z.string().min(1, 'Issuer is required').max(150),
  date: z.string().min(1, 'Date is required'),
  description: z.string().max(1000).optional().or(z.literal('')),
  category: z.string().max(80).optional().or(z.literal('')),
});

export const PublicationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  publisher: z.string().min(1, 'Publisher is required').max(150),
  publication_date: z.string().min(1, 'Publication date is required'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().max(1500).optional().or(z.literal('')),
  authors: z.string().max(200).optional().or(z.literal('')),
});

export const LanguageSchema = z.object({
  id: z.string().optional(),
  language: z.string().min(1, 'Language is required').max(80),
  proficiency: z.enum(['Native', 'Fluent', 'Professional', 'Conversational']),
});
