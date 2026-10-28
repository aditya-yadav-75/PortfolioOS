export interface PortfolioProfile {
  id: string;
  full_name: string;
  headline: string;
  email: string;
  phone?: string;
  location?: string;
  website_url?: string;
  github_url?: string;
  linkedin_url?: string;
  summary: string;
  career_objective?: string;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  gpa?: string;
  honors?: string;
  location?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export type SkillCategory = 'Languages' | 'Frameworks & Libraries' | 'Databases & Cloud' | 'Tools & DevOps' | 'Core Concepts' | 'Soft Skills';
export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
  years_experience?: number;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  role?: string;
  start_date?: string;
  end_date?: string;
  description: string;
  bullet_points: string[];
  technologies: string[];
  github_url?: string;
  live_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export type EmploymentType = 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Freelance';

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  employment_type: EmploymentType;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string;
  bullet_points: string[];
  technologies?: string[];
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  publication_date: string;
  url?: string;
  description?: string;
  authors?: string;
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Conversational';
  created_at: string;
  updated_at: string;
}

export interface CompletePortfolio {
  profile: PortfolioProfile | null;
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  experiences: Experience[];
  achievements: Achievement[];
  publications: Publication[];
  languages: Language[];
}
