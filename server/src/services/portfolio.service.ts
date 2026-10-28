import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection';
import {
  PortfolioProfile,
  Education,
  Skill,
  Certification,
  Project,
  Experience,
  Achievement,
  Publication,
  Language,
  CompletePortfolio
} from '@portfolio-os/shared';

export class PortfolioService {
  private db = getDatabase();

  // Profile
  getProfile(): PortfolioProfile | null {
    const row = this.db.prepare('SELECT * FROM portfolio_profile LIMIT 1').get() as any;
    if (!row) return null;
    return {
      id: row.id,
      full_name: row.full_name,
      headline: row.headline,
      email: row.email,
      phone: row.phone || '',
      location: row.location || '',
      website_url: row.website_url || '',
      github_url: row.github_url || '',
      linkedin_url: row.linkedin_url || '',
      summary: row.summary,
      career_objective: row.career_objective || '',
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  updateProfile(data: Partial<PortfolioProfile>): PortfolioProfile {
    const existing = this.getProfile();
    const id = existing?.id || uuidv4();
    const now = new Date().toISOString();

    if (existing) {
      this.db.prepare(`
        UPDATE portfolio_profile
        SET full_name = ?, headline = ?, email = ?, phone = ?, location = ?,
            website_url = ?, github_url = ?, linkedin_url = ?, summary = ?,
            career_objective = ?, updated_at = ?
        WHERE id = ?
      `).run(
        data.full_name ?? existing.full_name,
        data.headline ?? existing.headline,
        data.email ?? existing.email,
        data.phone ?? existing.phone,
        data.location ?? existing.location,
        data.website_url ?? existing.website_url,
        data.github_url ?? existing.github_url,
        data.linkedin_url ?? existing.linkedin_url,
        data.summary ?? existing.summary,
        data.career_objective ?? existing.career_objective,
        now,
        id
      );
    } else {
      this.db.prepare(`
        INSERT INTO portfolio_profile
          (id, full_name, headline, email, phone, location, website_url, github_url, linkedin_url, summary, career_objective, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        data.full_name || 'Anonymous Developer',
        data.headline || 'Software Engineer',
        data.email || 'developer@example.com',
        data.phone || '',
        data.location || '',
        data.website_url || '',
        data.github_url || '',
        data.linkedin_url || '',
        data.summary || '',
        data.career_objective || '',
        now,
        now
      );
    }

    return this.getProfile()!;
  }

  // Education
  getEducationList(): Education[] {
    const rows = this.db.prepare('SELECT * FROM education ORDER BY start_date DESC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      institution: r.institution,
      degree: r.degree,
      field_of_study: r.field_of_study,
      start_date: r.start_date,
      end_date: r.end_date || '',
      is_current: Boolean(r.is_current),
      gpa: r.gpa || '',
      honors: r.honors || '',
      location: r.location || '',
      description: r.description || '',
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  }

  addEducation(data: Omit<Education, 'id' | 'created_at' | 'updated_at'>): Education {
    const id = uuidv4();
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO education (id, institution, degree, field_of_study, start_date, end_date, is_current, gpa, honors, location, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.institution,
      data.degree,
      data.field_of_study,
      data.start_date,
      data.end_date || null,
      data.is_current ? 1 : 0,
      data.gpa || null,
      data.honors || null,
      data.location || null,
      data.description || null,
      now,
      now
    );
    return this.getEducationById(id)!;
  }

  updateEducation(id: string, data: Partial<Education>): Education | null {
    const existing = this.getEducationById(id);
    if (!existing) return null;
    const now = new Date().toISOString();
    this.db.prepare(`
      UPDATE education
      SET institution = ?, degree = ?, field_of_study = ?, start_date = ?, end_date = ?,
          is_current = ?, gpa = ?, honors = ?, location = ?, description = ?, updated_at = ?
      WHERE id = ?
    `).run(
      data.institution ?? existing.institution,
      data.degree ?? existing.degree,
      data.field_of_study ?? existing.field_of_study,
      data.start_date ?? existing.start_date,
      data.end_date !== undefined ? data.end_date : existing.end_date,
      data.is_current !== undefined ? (data.is_current ? 1 : 0) : (existing.is_current ? 1 : 0),
      data.gpa !== undefined ? data.gpa : existing.gpa,
      data.honors !== undefined ? data.honors : existing.honors,
      data.location !== undefined ? data.location : existing.location,
      data.description !== undefined ? data.description : existing.description,
      now,
      id
    );
    return this.getEducationById(id);
  }

  deleteEducation(id: string): boolean {
    const res = this.db.prepare('DELETE FROM education WHERE id = ?').run(id);
    return res.changes > 0;
  }

  private getEducationById(id: string): Education | null {
    const r = this.db.prepare('SELECT * FROM education WHERE id = ?').get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      institution: r.institution,
      degree: r.degree,
      field_of_study: r.field_of_study,
      start_date: r.start_date,
      end_date: r.end_date || '',
      is_current: Boolean(r.is_current),
      gpa: r.gpa || '',
      honors: r.honors || '',
      location: r.location || '',
      description: r.description || '',
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  }

  // Skills
  getSkills(): Skill[] {
    const rows = this.db.prepare('SELECT * FROM skills ORDER BY category ASC, name ASC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      proficiency: r.proficiency,
      years_experience: r.years_experience !== null ? Number(r.years_experience) : undefined,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  }

  addSkill(data: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Skill {
    const id = uuidv4();
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO skills (id, name, category, proficiency, years_experience, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.name,
      data.category,
      data.proficiency,
      data.years_experience ?? null,
      now,
      now
    );
    return this.getSkillById(id)!;
  }

  updateSkill(id: string, data: Partial<Skill>): Skill | null {
    const existing = this.getSkillById(id);
    if (!existing) return null;
    const now = new Date().toISOString();
    this.db.prepare(`
      UPDATE skills
      SET name = ?, category = ?, proficiency = ?, years_experience = ?, updated_at = ?
      WHERE id = ?
    `).run(
      data.name ?? existing.name,
      data.category ?? existing.category,
      data.proficiency ?? existing.proficiency,
      data.years_experience !== undefined ? data.years_experience : existing.years_experience,
      now,
      id
    );
    return this.getSkillById(id);
  }

  deleteSkill(id: string): boolean {
    const res = this.db.prepare('DELETE FROM skills WHERE id = ?').run(id);
    return res.changes > 0;
  }

  private getSkillById(id: string): Skill | null {
    const r = this.db.prepare('SELECT * FROM skills WHERE id = ?').get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      name: r.name,
      category: r.category,
      proficiency: r.proficiency,
      years_experience: r.years_experience !== null ? Number(r.years_experience) : undefined,
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  }

  // Certifications
  getCertifications(): Certification[] {
    const rows = this.db.prepare('SELECT * FROM certifications ORDER BY issue_date DESC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      issuer: r.issuer,
      issue_date: r.issue_date,
      expiration_date: r.expiration_date || '',
      credential_id: r.credential_id || '',
      credential_url: r.credential_url || '',
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  }

  addCertification(data: Omit<Certification, 'id' | 'created_at' | 'updated_at'>): Certification {
    const id = uuidv4();
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO certifications (id, title, issuer, issue_date, expiration_date, credential_id, credential_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.issuer,
      data.issue_date,
      data.expiration_date || null,
      data.credential_id || null,
      data.credential_url || null,
      now,
      now
    );
    return this.getCertificationById(id)!;
  }

  updateCertification(id: string, data: Partial<Certification>): Certification | null {
    const existing = this.getCertificationById(id);
    if (!existing) return null;
    const now = new Date().toISOString();
    this.db.prepare(`
      UPDATE certifications
      SET title = ?, issuer = ?, issue_date = ?, expiration_date = ?, credential_id = ?, credential_url = ?, updated_at = ?
      WHERE id = ?
    `).run(
      data.title ?? existing.title,
      data.issuer ?? existing.issuer,
      data.issue_date ?? existing.issue_date,
      data.expiration_date !== undefined ? data.expiration_date : existing.expiration_date,
      data.credential_id !== undefined ? data.credential_id : existing.credential_id,
      data.credential_url !== undefined ? data.credential_url : existing.credential_url,
      now,
      id
    );
    return this.getCertificationById(id);
  }

  deleteCertification(id: string): boolean {
    const res = this.db.prepare('DELETE FROM certifications WHERE id = ?').run(id);
    return res.changes > 0;
  }

  private getCertificationById(id: string): Certification | null {
    const r = this.db.prepare('SELECT * FROM certifications WHERE id = ?').get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      title: r.title,
      issuer: r.issuer,
      issue_date: r.issue_date,
      expiration_date: r.expiration_date || '',
      credential_id: r.credential_id || '',
      credential_url: r.credential_url || '',
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  }

  // Projects
  getProjects(): Project[] {
    const rows = this.db.prepare('SELECT * FROM projects ORDER BY featured DESC, start_date DESC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle || '',
      role: r.role || '',
      start_date: r.start_date || '',
      end_date: r.end_date || '',
      description: r.description,
      bullet_points: JSON.parse(r.bullet_points || '[]'),
      technologies: JSON.parse(r.technologies || '[]'),
      github_url: r.github_url || '',
      live_url: r.live_url || '',
      featured: Boolean(r.featured),
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  }

  addProject(data: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project {
    const id = uuidv4();
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO projects (id, title, subtitle, role, start_date, end_date, description, bullet_points, technologies, github_url, live_url, featured, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.subtitle || null,
      data.role || null,
      data.start_date || null,
      data.end_date || null,
      data.description,
      JSON.stringify(data.bullet_points || []),
      JSON.stringify(data.technologies || []),
      data.github_url || null,
      data.live_url || null,
      data.featured ? 1 : 0,
      now,
      now
    );
    return this.getProjectById(id)!;
  }

  updateProject(id: string, data: Partial<Project>): Project | null {
    const existing = this.getProjectById(id);
    if (!existing) return null;
    const now = new Date().toISOString();
    this.db.prepare(`
      UPDATE projects
      SET title = ?, subtitle = ?, role = ?, start_date = ?, end_date = ?,
          description = ?, bullet_points = ?, technologies = ?, github_url = ?, live_url = ?, featured = ?, updated_at = ?
      WHERE id = ?
    `).run(
      data.title ?? existing.title,
      data.subtitle !== undefined ? data.subtitle : existing.subtitle,
      data.role !== undefined ? data.role : existing.role,
      data.start_date !== undefined ? data.start_date : existing.start_date,
      data.end_date !== undefined ? data.end_date : existing.end_date,
      data.description ?? existing.description,
      data.bullet_points ? JSON.stringify(data.bullet_points) : JSON.stringify(existing.bullet_points),
      data.technologies ? JSON.stringify(data.technologies) : JSON.stringify(existing.technologies),
      data.github_url !== undefined ? data.github_url : existing.github_url,
      data.live_url !== undefined ? data.live_url : existing.live_url,
      data.featured !== undefined ? (data.featured ? 1 : 0) : (existing.featured ? 1 : 0),
      now,
      id
    );
    return this.getProjectById(id);
  }

  deleteProject(id: string): boolean {
    const res = this.db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return res.changes > 0;
  }

  private getProjectById(id: string): Project | null {
    const r = this.db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      title: r.title,
      subtitle: r.subtitle || '',
      role: r.role || '',
      start_date: r.start_date || '',
      end_date: r.end_date || '',
      description: r.description,
      bullet_points: JSON.parse(r.bullet_points || '[]'),
      technologies: JSON.parse(r.technologies || '[]'),
      github_url: r.github_url || '',
      live_url: r.live_url || '',
      featured: Boolean(r.featured),
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  }

  // Experience
  getExperiences(): Experience[] {
    const rows = this.db.prepare('SELECT * FROM experiences ORDER BY start_date DESC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      company: r.company,
      role: r.role,
      location: r.location || '',
      employment_type: r.employment_type,
      start_date: r.start_date,
      end_date: r.end_date || '',
      is_current: Boolean(r.is_current),
      description: r.description,
      bullet_points: JSON.parse(r.bullet_points || '[]'),
      technologies: JSON.parse(r.technologies || '[]'),
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  }

  addExperience(data: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Experience {
    const id = uuidv4();
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO experiences (id, company, role, location, employment_type, start_date, end_date, is_current, description, bullet_points, technologies, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.company,
      data.role,
      data.location || null,
      data.employment_type,
      data.start_date,
      data.end_date || null,
      data.is_current ? 1 : 0,
      data.description,
      JSON.stringify(data.bullet_points || []),
      JSON.stringify(data.technologies || []),
      now,
      now
    );
    return this.getExperienceById(id)!;
  }

  updateExperience(id: string, data: Partial<Experience>): Experience | null {
    const existing = this.getExperienceById(id);
    if (!existing) return null;
    const now = new Date().toISOString();
    this.db.prepare(`
      UPDATE experiences
      SET company = ?, role = ?, location = ?, employment_type = ?, start_date = ?,
          end_date = ?, is_current = ?, description = ?, bullet_points = ?, technologies = ?, updated_at = ?
      WHERE id = ?
    `).run(
      data.company ?? existing.company,
      data.role ?? existing.role,
      data.location !== undefined ? data.location : existing.location,
      data.employment_type ?? existing.employment_type,
      data.start_date ?? existing.start_date,
      data.end_date !== undefined ? data.end_date : existing.end_date,
      data.is_current !== undefined ? (data.is_current ? 1 : 0) : (existing.is_current ? 1 : 0),
      data.description ?? existing.description,
      data.bullet_points ? JSON.stringify(data.bullet_points) : JSON.stringify(existing.bullet_points),
      data.technologies ? JSON.stringify(data.technologies) : JSON.stringify(existing.technologies),
      now,
      id
    );
    return this.getExperienceById(id);
  }

  deleteExperience(id: string): boolean {
    const res = this.db.prepare('DELETE FROM experiences WHERE id = ?').run(id);
    return res.changes > 0;
  }

  private getExperienceById(id: string): Experience | null {
    const r = this.db.prepare('SELECT * FROM experiences WHERE id = ?').get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      company: r.company,
      role: r.role,
      location: r.location || '',
      employment_type: r.employment_type,
      start_date: r.start_date,
      end_date: r.end_date || '',
      is_current: Boolean(r.is_current),
      description: r.description,
      bullet_points: JSON.parse(r.bullet_points || '[]'),
      technologies: JSON.parse(r.technologies || '[]'),
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  }

  // Achievements
  getAchievements(): Achievement[] {
    const rows = this.db.prepare('SELECT * FROM achievements ORDER BY date DESC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      issuer: r.issuer,
      date: r.date,
      description: r.description || '',
      category: r.category || '',
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  }

  addAchievement(data: Omit<Achievement, 'id' | 'created_at' | 'updated_at'>): Achievement {
    const id = uuidv4();
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO achievements (id, title, issuer, date, description, category, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.issuer,
      data.date,
      data.description || null,
      data.category || null,
      now,
      now
    );
    return this.getAchievementById(id)!;
  }

  deleteAchievement(id: string): boolean {
    const res = this.db.prepare('DELETE FROM achievements WHERE id = ?').run(id);
    return res.changes > 0;
  }

  private getAchievementById(id: string): Achievement | null {
    const r = this.db.prepare('SELECT * FROM achievements WHERE id = ?').get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      title: r.title,
      issuer: r.issuer,
      date: r.date,
      description: r.description || '',
      category: r.category || '',
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  }

  // Publications
  getPublications(): Publication[] {
    const rows = this.db.prepare('SELECT * FROM publications ORDER BY publication_date DESC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      publisher: r.publisher,
      publication_date: r.publication_date,
      url: r.url || '',
      description: r.description || '',
      authors: r.authors || '',
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  }

  addPublication(data: Omit<Publication, 'id' | 'created_at' | 'updated_at'>): Publication {
    const id = uuidv4();
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO publications (id, title, publisher, publication_date, url, description, authors, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.publisher,
      data.publication_date,
      data.url || null,
      data.description || null,
      data.authors || null,
      now,
      now
    );
    return this.getPublicationById(id)!;
  }

  deletePublication(id: string): boolean {
    const res = this.db.prepare('DELETE FROM publications WHERE id = ?').run(id);
    return res.changes > 0;
  }

  private getPublicationById(id: string): Publication | null {
    const r = this.db.prepare('SELECT * FROM publications WHERE id = ?').get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      title: r.title,
      publisher: r.publisher,
      publication_date: r.publication_date,
      url: r.url || '',
      description: r.description || '',
      authors: r.authors || '',
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  }

  // Languages
  getLanguages(): Language[] {
    const rows = this.db.prepare('SELECT * FROM languages ORDER BY language ASC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      language: r.language,
      proficiency: r.proficiency,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  }

  addLanguage(data: Omit<Language, 'id' | 'created_at' | 'updated_at'>): Language {
    const id = uuidv4();
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO languages (id, language, proficiency, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, data.language, data.proficiency, now, now);
    return this.getLanguageById(id)!;
  }

  deleteLanguage(id: string): boolean {
    const res = this.db.prepare('DELETE FROM languages WHERE id = ?').run(id);
    return res.changes > 0;
  }

  private getLanguageById(id: string): Language | null {
    const r = this.db.prepare('SELECT * FROM languages WHERE id = ?').get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      language: r.language,
      proficiency: r.proficiency,
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  }

  // Complete Portfolio
  getCompletePortfolio(): CompletePortfolio {
    return {
      profile: this.getProfile(),
      education: this.getEducationList(),
      skills: this.getSkills(),
      certifications: this.getCertifications(),
      projects: this.getProjects(),
      experiences: this.getExperiences(),
      achievements: this.getAchievements(),
      publications: this.getPublications(),
      languages: this.getLanguages(),
    };
  }

  // Atomic Import & Export
  importPortfolio(data: CompletePortfolio): boolean {
    const transaction = this.db.transaction(() => {
      // Clear current data
      this.db.prepare('DELETE FROM resume_sections').run();
      this.db.prepare('DELETE FROM resume_documents').run();
      this.db.prepare('DELETE FROM project_skills').run();
      this.db.prepare('DELETE FROM projects').run();
      this.db.prepare('DELETE FROM experiences').run();
      this.db.prepare('DELETE FROM education').run();
      this.db.prepare('DELETE FROM skills').run();
      this.db.prepare('DELETE FROM certifications').run();
      this.db.prepare('DELETE FROM achievements').run();
      this.db.prepare('DELETE FROM publications').run();
      this.db.prepare('DELETE FROM languages').run();
      this.db.prepare('DELETE FROM portfolio_profile').run();

      const now = new Date().toISOString();

      if (data.profile) {
        this.db.prepare(`
          INSERT INTO portfolio_profile (id, full_name, headline, email, phone, location, website_url, github_url, linkedin_url, summary, career_objective, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          data.profile.id || uuidv4(),
          data.profile.full_name,
          data.profile.headline,
          data.profile.email,
          data.profile.phone || null,
          data.profile.location || null,
          data.profile.website_url || null,
          data.profile.github_url || null,
          data.profile.linkedin_url || null,
          data.profile.summary,
          data.profile.career_objective || null,
          data.profile.created_at || now,
          now
        );
      }

      for (const edu of data.education || []) {
        this.db.prepare(`
          INSERT INTO education (id, institution, degree, field_of_study, start_date, end_date, is_current, gpa, honors, location, description, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          edu.id || uuidv4(),
          edu.institution,
          edu.degree,
          edu.field_of_study,
          edu.start_date,
          edu.end_date || null,
          edu.is_current ? 1 : 0,
          edu.gpa || null,
          edu.honors || null,
          edu.location || null,
          edu.description || null,
          edu.created_at || now,
          now
        );
      }

      for (const skill of data.skills || []) {
        this.db.prepare(`
          INSERT INTO skills (id, name, category, proficiency, years_experience, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          skill.id || uuidv4(),
          skill.name,
          skill.category,
          skill.proficiency,
          skill.years_experience ?? null,
          skill.created_at || now,
          now
        );
      }

      for (const cert of data.certifications || []) {
        this.db.prepare(`
          INSERT INTO certifications (id, title, issuer, issue_date, expiration_date, credential_id, credential_url, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          cert.id || uuidv4(),
          cert.title,
          cert.issuer,
          cert.issue_date,
          cert.expiration_date || null,
          cert.credential_id || null,
          cert.credential_url || null,
          cert.created_at || now,
          now
        );
      }

      for (const proj of data.projects || []) {
        this.db.prepare(`
          INSERT INTO projects (id, title, subtitle, role, start_date, end_date, description, bullet_points, technologies, github_url, live_url, featured, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          proj.id || uuidv4(),
          proj.title,
          proj.subtitle || null,
          proj.role || null,
          proj.start_date || null,
          proj.end_date || null,
          proj.description,
          JSON.stringify(proj.bullet_points || []),
          JSON.stringify(proj.technologies || []),
          proj.github_url || null,
          proj.live_url || null,
          proj.featured ? 1 : 0,
          proj.created_at || now,
          now
        );
      }

      for (const exp of data.experiences || []) {
        this.db.prepare(`
          INSERT INTO experiences (id, company, role, location, employment_type, start_date, end_date, is_current, description, bullet_points, technologies, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          exp.id || uuidv4(),
          exp.company,
          exp.role,
          exp.location || null,
          exp.employment_type,
          exp.start_date,
          exp.end_date || null,
          exp.is_current ? 1 : 0,
          exp.description,
          JSON.stringify(exp.bullet_points || []),
          JSON.stringify(exp.technologies || []),
          exp.created_at || now,
          now
        );
      }

      for (const ach of data.achievements || []) {
        this.db.prepare(`
          INSERT INTO achievements (id, title, issuer, date, description, category, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          ach.id || uuidv4(),
          ach.title,
          ach.issuer,
          ach.date,
          ach.description || null,
          ach.category || null,
          ach.created_at || now,
          now
        );
      }

      for (const pub of data.publications || []) {
        this.db.prepare(`
          INSERT INTO publications (id, title, publisher, publication_date, url, description, authors, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          pub.id || uuidv4(),
          pub.title,
          pub.publisher,
          pub.publication_date,
          pub.url || null,
          pub.description || null,
          pub.authors || null,
          pub.created_at || now,
          now
        );
      }

      for (const lang of data.languages || []) {
        this.db.prepare(`
          INSERT INTO languages (id, language, proficiency, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          lang.id || uuidv4(),
          lang.language,
          lang.proficiency,
          lang.created_at || now,
          now
        );
      }
    });

    transaction();
    return true;
  }
}
