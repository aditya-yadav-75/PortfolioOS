-- PortfolioOS SQLite Relational Schema
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS portfolio_profile (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  headline TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  website_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  summary TEXT NOT NULL,
  career_objective TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS education (
  id TEXT PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current INTEGER NOT NULL DEFAULT 0,
  gpa TEXT,
  honors TEXT,
  location TEXT,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  years_experience REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);

CREATE TABLE IF NOT EXISTS certifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  expiration_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  role TEXT,
  start_date TEXT,
  end_date TEXT,
  description TEXT NOT NULL,
  bullet_points TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
  technologies TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
  github_url TEXT,
  live_url TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

CREATE TABLE IF NOT EXISTS project_skills (
  project_id TEXT NOT NULL,
  skill_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (project_id, skill_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  employment_type TEXT NOT NULL DEFAULT 'Full-time',
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  bullet_points TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
  technologies TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS publications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  publisher TEXT NOT NULL,
  publication_date TEXT NOT NULL,
  url TEXT,
  description TEXT,
  authors TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS languages (
  id TEXT PRIMARY KEY,
  language TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS job_analyses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT,
  raw_job_description TEXT NOT NULL,
  analysis_result TEXT NOT NULL, -- JSON
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS resume_documents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  target_role TEXT NOT NULL,
  target_company TEXT,
  template TEXT NOT NULL DEFAULT 'modern_professional',
  typography TEXT NOT NULL, -- JSON
  professional_summary TEXT NOT NULL DEFAULT '',
  section_order TEXT NOT NULL, -- JSON array
  selected_skills TEXT NOT NULL DEFAULT '[]', -- JSON array of skill IDs
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS resume_sections (
  id TEXT PRIMARY KEY,
  resume_id TEXT NOT NULL,
  section_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_included INTEGER NOT NULL DEFAULT 1,
  custom_title TEXT,
  custom_bullets TEXT, -- JSON array
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (resume_id) REFERENCES resume_documents(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_resume_sections_resume ON resume_sections(resume_id);

CREATE TABLE IF NOT EXISTS sheets_sync_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  items_synced INTEGER NOT NULL DEFAULT 0,
  tab_name TEXT,
  error_message TEXT,
  spreadsheet_id TEXT NOT NULL,
  timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sync_logs_timestamp ON sheets_sync_logs(timestamp);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
