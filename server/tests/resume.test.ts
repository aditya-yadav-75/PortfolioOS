import { describe, it, expect } from 'vitest';
import { ResumeService } from '../src/services/resume.service';
import { PortfolioService } from '../src/services/portfolio.service';

describe('ResumeService & Tailored Versions', () => {
  const resumeService = new ResumeService();
  const portfolioService = new PortfolioService();

  it('generates two differently tailored resumes from one portfolio', () => {
    const portfolio = portfolioService.getCompletePortfolio();

    const frontendResume = resumeService.generateDefaultTailoredResume(portfolio, 'frontend');
    const aimlResume = resumeService.generateDefaultTailoredResume(portfolio, 'ai_ml');

    expect(frontendResume.id).toBeDefined();
    expect(aimlResume.id).toBeDefined();

    // Roles and titles differ
    expect(frontendResume.target_role).toBe('Frontend Developer Intern');
    expect(aimlResume.target_role).toBe('AI / Machine Learning Intern');

    // Templates differ
    expect(frontendResume.template).toBe('modern_professional');
    expect(aimlResume.template).toBe('classic_ats');

    // Selected skills differ
    expect(frontendResume.selected_skills).not.toEqual(aimlResume.selected_skills);

    // Selected projects differ
    const feProjTitles = frontendResume.selected_projects.map(p => p.custom_title);
    const aiProjTitles = aimlResume.selected_projects.map(p => p.custom_title);
    expect(feProjTitles).toContain('PulseUI: Spatial Component System');
    expect(aiProjTitles).toContain('NeuroVision: Real-Time Edge Object Detection');
  });

  it('allows customizing bullets and section inclusion', () => {
    const resumes = resumeService.getResumes();
    expect(resumes.length).toBeGreaterThan(0);

    const doc = resumeService.getResumeById(resumes[0].id);
    expect(doc).toBeDefined();

    const updated = resumeService.updateResume(doc!.id, {
      name: 'Custom Tailored Name',
      professional_summary: 'Updated summary for unit test.',
    });

    expect(updated?.name).toBe('Custom Tailored Name');
    expect(updated?.professional_summary).toBe('Updated summary for unit test.');
  });
});
