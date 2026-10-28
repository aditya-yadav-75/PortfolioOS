import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection';
import {
  ResumeDocument,
  ResumeVersionSummary,
  SelectedResumeItem,
  ResumeSectionType,
  ResumeTemplateType,
  CompletePortfolio
} from '@portfolio-os/shared';

export class ResumeService {
  private db = getDatabase();

  getResumes(): ResumeVersionSummary[] {
    const rows = this.db.prepare('SELECT id, name, target_role, template, created_at, updated_at FROM resume_documents ORDER BY updated_at DESC').all() as any[];
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      target_role: r.target_role,
      template: r.template as ResumeTemplateType,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  }

  getResumeById(id: string): ResumeDocument | null {
    const doc = this.db.prepare('SELECT * FROM resume_documents WHERE id = ?').get(id) as any;
    if (!doc) return null;

    const sections = this.db.prepare('SELECT * FROM resume_sections WHERE resume_id = ? ORDER BY order_index ASC').all(id) as any[];

    const parseSection = (type: ResumeSectionType): SelectedResumeItem[] => {
      return sections
        .filter(s => s.section_type === type)
        .map(s => ({
          id: s.id,
          item_id: s.item_id,
          section_type: s.section_type as ResumeSectionType,
          order_index: s.order_index,
          is_included: Boolean(s.is_included),
          custom_title: s.custom_title || undefined,
          custom_bullets: s.custom_bullets ? JSON.parse(s.custom_bullets) : undefined,
        }));
    };

    return {
      id: doc.id,
      name: doc.name,
      target_role: doc.target_role,
      target_company: doc.target_company || undefined,
      template: doc.template as ResumeTemplateType,
      typography: JSON.parse(doc.typography),
      professional_summary: doc.professional_summary,
      section_order: JSON.parse(doc.section_order),
      selected_skills: JSON.parse(doc.selected_skills || '[]'),
      selected_projects: parseSection('projects'),
      selected_experience: parseSection('experience'),
      selected_education: parseSection('education'),
      selected_certifications: parseSection('certifications'),
      selected_achievements: parseSection('achievements'),
      created_at: doc.created_at,
      updated_at: doc.updated_at,
    };
  }

  createResume(data: Omit<ResumeDocument, 'id' | 'created_at' | 'updated_at'>): ResumeDocument {
    const id = uuidv4();
    const now = new Date().toISOString();

    const transaction = this.db.transaction(() => {
      this.db.prepare(`
        INSERT INTO resume_documents
          (id, name, target_role, target_company, template, typography, professional_summary, section_order, selected_skills, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        data.name,
        data.target_role,
        data.target_company || null,
        data.template,
        JSON.stringify(data.typography),
        data.professional_summary,
        JSON.stringify(data.section_order),
        JSON.stringify(data.selected_skills || []),
        now,
        now
      );

      const insertSection = this.db.prepare(`
        INSERT INTO resume_sections
          (id, resume_id, section_type, item_id, order_index, is_included, custom_title, custom_bullets, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const allItems = [
        ...(data.selected_projects || []),
        ...(data.selected_experience || []),
        ...(data.selected_education || []),
        ...(data.selected_certifications || []),
        ...(data.selected_achievements || []),
      ];

      for (const item of allItems) {
        insertSection.run(
          item.id || uuidv4(),
          id,
          item.section_type,
          item.item_id,
          item.order_index,
          item.is_included ? 1 : 0,
          item.custom_title || null,
          item.custom_bullets ? JSON.stringify(item.custom_bullets) : null,
          now,
          now
        );
      }
    });

    transaction();
    return this.getResumeById(id)!;
  }

  updateResume(id: string, data: Partial<ResumeDocument>): ResumeDocument | null {
    const existing = this.getResumeById(id);
    if (!existing) return null;

    const now = new Date().toISOString();

    const transaction = this.db.transaction(() => {
      this.db.prepare(`
        UPDATE resume_documents
        SET name = ?, target_role = ?, target_company = ?, template = ?,
            typography = ?, professional_summary = ?, section_order = ?, selected_skills = ?, updated_at = ?
        WHERE id = ?
      `).run(
        data.name ?? existing.name,
        data.target_role ?? existing.target_role,
        data.target_company !== undefined ? data.target_company : existing.target_company,
        data.template ?? existing.template,
        data.typography ? JSON.stringify(data.typography) : JSON.stringify(existing.typography),
        data.professional_summary ?? existing.professional_summary,
        data.section_order ? JSON.stringify(data.section_order) : JSON.stringify(existing.section_order),
        data.selected_skills ? JSON.stringify(data.selected_skills) : JSON.stringify(existing.selected_skills),
        now,
        id
      );

      // If sections provided, replace sections
      const hasSectionsProvided = Boolean(
        data.selected_projects ||
        data.selected_experience ||
        data.selected_education ||
        data.selected_certifications ||
        data.selected_achievements
      );

      if (hasSectionsProvided) {
        this.db.prepare('DELETE FROM resume_sections WHERE resume_id = ?').run(id);

        const insertSection = this.db.prepare(`
          INSERT INTO resume_sections
            (id, resume_id, section_type, item_id, order_index, is_included, custom_title, custom_bullets, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const allItems = [
          ...(data.selected_projects ?? existing.selected_projects),
          ...(data.selected_experience ?? existing.selected_experience),
          ...(data.selected_education ?? existing.selected_education),
          ...(data.selected_certifications ?? existing.selected_certifications),
          ...(data.selected_achievements ?? existing.selected_achievements),
        ];

        for (const item of allItems) {
          insertSection.run(
            item.id || uuidv4(),
            id,
            item.section_type,
            item.item_id,
            item.order_index,
            item.is_included ? 1 : 0,
            item.custom_title || null,
            item.custom_bullets ? JSON.stringify(item.custom_bullets) : null,
            now,
            now
          );
        }
      }
    });

    transaction();
    return this.getResumeById(id);
  }

  deleteResume(id: string): boolean {
    const res = this.db.prepare('DELETE FROM resume_documents WHERE id = ?').run(id);
    return res.changes > 0;
  }

  // Generate an initial default resume tailored from portfolio records
  generateDefaultTailoredResume(
    portfolio: CompletePortfolio,
    targetRole: 'frontend' | 'ai_ml' | 'general'
  ): ResumeDocument {
    if (targetRole === 'frontend') {
      const selectedSkillIds = portfolio.skills
        .filter(s => ['TypeScript', 'JavaScript (ES6+)', 'React', 'Next.js', 'Tailwind CSS', 'HTML5 & CSS3', 'Vite & Webpack', 'Node.js & Express'].includes(s.name))
        .map(s => s.id);

      const frontendProjects = portfolio.projects
        .filter(p => p.title.includes('PulseUI') || p.title.includes('FinTrack') || p.technologies.includes('React'))
        .map((p, idx) => ({
          id: uuidv4(),
          item_id: p.id,
          section_type: 'projects' as ResumeSectionType,
          order_index: idx,
          is_included: true,
          custom_title: p.title,
          custom_bullets: p.bullet_points,
        }));

      const frontendExp = portfolio.experiences
        .map((e, idx) => ({
          id: uuidv4(),
          item_id: e.id,
          section_type: 'experience' as ResumeSectionType,
          order_index: idx,
          is_included: true,
          custom_title: `${e.role} — ${e.company}`,
          custom_bullets: e.bullet_points,
        }));

      const frontendEdu = portfolio.education.map((ed, idx) => ({
        id: uuidv4(),
        item_id: ed.id,
        section_type: 'education' as ResumeSectionType,
        order_index: idx,
        is_included: true,
      }));

      const frontendCerts = portfolio.certifications
        .filter(c => c.title.includes('Front-End') || c.issuer.includes('Meta'))
        .map((c, idx) => ({
          id: uuidv4(),
          item_id: c.id,
          section_type: 'certifications' as ResumeSectionType,
          order_index: idx,
          is_included: true,
        }));

      return this.createResume({
        name: 'Alex Morgan — Frontend Developer Resume',
        target_role: 'Frontend Developer Intern',
        target_company: 'Vanguard Tech Labs / Next-Gen Tech',
        template: 'modern_professional',
        typography: {
          font_family: 'sans',
          font_size: 'normal',
          spacing: 'standard',
          accent_color: '#0284C7',
          paper_tone: 'white',
        },
        professional_summary: 'Frontend-focused software engineering student with proven production experience developing high-performance React and TypeScript web interfaces. Architect of the open-source PulseUI spatial design system and experienced in building accessible, component-driven web applications.',
        section_order: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications'],
        selected_skills: selectedSkillIds,
        selected_projects: frontendProjects,
        selected_experience: frontendExp,
        selected_education: frontendEdu,
        selected_certifications: frontendCerts,
        selected_achievements: [],
      });
    } else if (targetRole === 'ai_ml') {
      const selectedSkillIds = portfolio.skills
        .filter(s => ['Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'Docker', 'SQLite', 'Model Evaluation & Optimization', 'Git & GitHub'].includes(s.name))
        .map(s => s.id);

      const aimlProjects = portfolio.projects
        .filter(p => p.title.includes('NeuroVision') || p.title.includes('DocuSphere') || p.technologies.includes('PyTorch'))
        .map((p, idx) => ({
          id: uuidv4(),
          item_id: p.id,
          section_type: 'projects' as ResumeSectionType,
          order_index: idx,
          is_included: true,
          custom_title: p.title,
          custom_bullets: p.bullet_points,
        }));

      const aimlExp = portfolio.experiences
        .map((e, idx) => ({
          id: uuidv4(),
          item_id: e.id,
          section_type: 'experience' as ResumeSectionType,
          order_index: idx,
          is_included: true,
          custom_title: `${e.role} — ${e.company}`,
          custom_bullets: e.bullet_points,
        }));

      const aimlEdu = portfolio.education.map((ed, idx) => ({
        id: uuidv4(),
        item_id: ed.id,
        section_type: 'education' as ResumeSectionType,
        order_index: idx,
        is_included: true,
      }));

      const aimlCerts = portfolio.certifications
        .filter(c => c.title.includes('Deep Learning') || c.issuer.includes('DeepLearning.AI'))
        .map((c, idx) => ({
          id: uuidv4(),
          item_id: c.id,
          section_type: 'certifications' as ResumeSectionType,
          order_index: idx,
          is_included: true,
        }));

      const aimlAchs = portfolio.achievements
        .filter(a => a.title.includes('HackAI') || a.title.includes('1st Place'))
        .map((a, idx) => ({
          id: uuidv4(),
          item_id: a.id,
          section_type: 'achievements' as ResumeSectionType,
          order_index: idx,
          is_included: true,
        }));

      return this.createResume({
        name: 'Alex Morgan — AI & ML Engineer Resume',
        target_role: 'AI / Machine Learning Intern',
        target_company: 'Applied AI Labs',
        template: 'classic_ats',
        typography: {
          font_family: 'serif',
          font_size: 'normal',
          spacing: 'standard',
          accent_color: '#0F172A',
          paper_tone: 'white',
        },
        professional_summary: 'Applied Machine Learning researcher and systems engineer with practical experience training, quantizing, and deploying edge computer vision models and RAG knowledge pipelines using PyTorch, ONNX Runtime, and FastAPI. Winner of CalTech HackAI 2024.',
        section_order: ['summary', 'education', 'skills', 'experience', 'projects', 'certifications', 'achievements'],
        selected_skills: selectedSkillIds,
        selected_projects: aimlProjects,
        selected_experience: aimlExp,
        selected_education: aimlEdu,
        selected_certifications: aimlCerts,
        selected_achievements: aimlAchs,
      });
    } else {
      // General
      return this.createResume({
        name: 'Alex Morgan — General Software Engineer Resume',
        target_role: 'Software Engineer Intern',
        target_company: '',
        template: 'modern_professional',
        typography: {
          font_family: 'sans',
          font_size: 'normal',
          spacing: 'standard',
          accent_color: '#0284C7',
          paper_tone: 'white',
        },
        professional_summary: portfolio.profile?.summary || 'Computer Science student and full-stack software engineer.',
        section_order: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications'],
        selected_skills: portfolio.skills.slice(0, 8).map(s => s.id),
        selected_projects: portfolio.projects.slice(0, 2).map((p, idx) => ({
          id: uuidv4(),
          item_id: p.id,
          section_type: 'projects' as ResumeSectionType,
          order_index: idx,
          is_included: true,
          custom_title: p.title,
          custom_bullets: p.bullet_points,
        })),
        selected_experience: portfolio.experiences.map((e, idx) => ({
          id: uuidv4(),
          item_id: e.id,
          section_type: 'experience' as ResumeSectionType,
          order_index: idx,
          is_included: true,
          custom_title: `${e.role} — ${e.company}`,
          custom_bullets: e.bullet_points,
        })),
        selected_education: portfolio.education.map((ed, idx) => ({
          id: uuidv4(),
          item_id: ed.id,
          section_type: 'education' as ResumeSectionType,
          order_index: idx,
          is_included: true,
        })),
        selected_certifications: portfolio.certifications.map((c, idx) => ({
          id: uuidv4(),
          item_id: c.id,
          section_type: 'certifications' as ResumeSectionType,
          order_index: idx,
          is_included: true,
        })),
        selected_achievements: [],
      });
    }
  }
}
