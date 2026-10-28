import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import path from 'path';
import fs from 'fs';
import { getDatabase, closeDatabase } from '../src/database/connection';
import { runMigrations } from '../src/database/migrator';
import { PortfolioService } from '../src/services/portfolio.service';

const testDbPath = path.resolve(__dirname, 'test_portfolio.db');

describe('PortfolioService & Database Operations', () => {
  let service: PortfolioService;

  beforeAll(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    getDatabase(testDbPath);
    runMigrations(testDbPath);
    service = new PortfolioService();
  });

  afterAll(() => {
    closeDatabase();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  });

  it('creates and retrieves a portfolio profile', () => {
    const profile = service.updateProfile({
      full_name: 'Test Candidate',
      headline: 'Full-Stack Developer',
      email: 'test@example.com',
      summary: 'Proficient in modern web technologies and API design.',
    });

    expect(profile).toBeDefined();
    expect(profile.full_name).toBe('Test Candidate');
    expect(profile.headline).toBe('Full-Stack Developer');

    const fetched = service.getProfile();
    expect(fetched?.email).toBe('test@example.com');
  });

  it('manages skills with category and proficiency levels', () => {
    const skill = service.addSkill({
      name: 'TypeScript',
      category: 'Languages',
      proficiency: 'Advanced',
      years_experience: 3,
    });

    expect(skill.id).toBeDefined();
    expect(skill.name).toBe('TypeScript');

    const allSkills = service.getSkills();
    expect(allSkills.some(s => s.name === 'TypeScript')).toBe(true);

    const updated = service.updateSkill(skill.id, { proficiency: 'Expert' });
    expect(updated?.proficiency).toBe('Expert');

    const deleted = service.deleteSkill(skill.id);
    expect(deleted).toBe(true);
    expect(service.getSkills().some(s => s.id === skill.id)).toBe(false);
  });

  it('manages projects with structured bullet points and technologies', () => {
    const proj = service.addProject({
      title: 'PortfolioOS Studio',
      description: 'An AI-driven resume builder with spatial UI.',
      bullet_points: ['Built reactive UI with Tailwind', 'Implemented SQLite schema'],
      technologies: ['React', 'TypeScript', 'SQLite'],
      featured: true,
    });

    expect(proj.title).toBe('PortfolioOS Studio');
    expect(proj.bullet_points.length).toBe(2);
    expect(proj.technologies).toContain('React');

    const allProjects = service.getProjects();
    expect(allProjects.length).toBeGreaterThan(0);
  });

  it('exports and imports complete portfolio cleanly in an atomic transaction', () => {
    const current = service.getCompletePortfolio();
    expect(current).toBeDefined();

    // Import
    const success = service.importPortfolio(current);
    expect(success).toBe(true);

    const afterImport = service.getCompletePortfolio();
    expect(afterImport.profile?.full_name).toBe('Test Candidate');
  });
});
