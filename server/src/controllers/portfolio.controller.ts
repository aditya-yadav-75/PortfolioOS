import { Request, Response } from 'express';
import { PortfolioService } from '../services/portfolio.service';

const portfolioService = new PortfolioService();

export class PortfolioController {
  // Complete Portfolio
  getCompletePortfolio(_req: Request, res: Response): void {
    const data = portfolioService.getCompletePortfolio();
    res.json({ success: true, data });
  }

  // Profile
  getProfile(_req: Request, res: Response): void {
    const profile = portfolioService.getProfile();
    res.json({ success: true, data: profile });
  }

  updateProfile(req: Request, res: Response): void {
    const updated = portfolioService.updateProfile(req.body);
    res.json({ success: true, data: updated });
  }

  // Education
  getEducationList(_req: Request, res: Response): void {
    const list = portfolioService.getEducationList();
    res.json({ success: true, data: list });
  }

  addEducation(req: Request, res: Response): void {
    const item = portfolioService.addEducation(req.body);
    res.status(201).json({ success: true, data: item });
  }

  updateEducation(req: Request, res: Response): void {
    const id = String(req.params.id);
    const item = portfolioService.updateEducation(id, req.body);
    if (!item) {
      res.status(404).json({ success: false, error: 'Education record not found' });
      return;
    }
    res.json({ success: true, data: item });
  }

  deleteEducation(req: Request, res: Response): void {
    const id = String(req.params.id);
    const deleted = portfolioService.deleteEducation(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Education record not found' });
      return;
    }
    res.json({ success: true, message: 'Education record deleted successfully' });
  }

  // Skills
  getSkills(_req: Request, res: Response): void {
    const list = portfolioService.getSkills();
    res.json({ success: true, data: list });
  }

  addSkill(req: Request, res: Response): void {
    const item = portfolioService.addSkill(req.body);
    res.status(201).json({ success: true, data: item });
  }

  updateSkill(req: Request, res: Response): void {
    const id = String(req.params.id);
    const item = portfolioService.updateSkill(id, req.body);
    if (!item) {
      res.status(404).json({ success: false, error: 'Skill record not found' });
      return;
    }
    res.json({ success: true, data: item });
  }

  deleteSkill(req: Request, res: Response): void {
    const id = String(req.params.id);
    const deleted = portfolioService.deleteSkill(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Skill record not found' });
      return;
    }
    res.json({ success: true, message: 'Skill deleted successfully' });
  }

  // Certifications
  getCertifications(_req: Request, res: Response): void {
    const list = portfolioService.getCertifications();
    res.json({ success: true, data: list });
  }

  addCertification(req: Request, res: Response): void {
    const item = portfolioService.addCertification(req.body);
    res.status(201).json({ success: true, data: item });
  }

  updateCertification(req: Request, res: Response): void {
    const id = String(req.params.id);
    const item = portfolioService.updateCertification(id, req.body);
    if (!item) {
      res.status(404).json({ success: false, error: 'Certification not found' });
      return;
    }
    res.json({ success: true, data: item });
  }

  deleteCertification(req: Request, res: Response): void {
    const id = String(req.params.id);
    const deleted = portfolioService.deleteCertification(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Certification not found' });
      return;
    }
    res.json({ success: true, message: 'Certification deleted successfully' });
  }

  // Projects
  getProjects(_req: Request, res: Response): void {
    const list = portfolioService.getProjects();
    res.json({ success: true, data: list });
  }

  addProject(req: Request, res: Response): void {
    const item = portfolioService.addProject(req.body);
    res.status(201).json({ success: true, data: item });
  }

  updateProject(req: Request, res: Response): void {
    const id = String(req.params.id);
    const item = portfolioService.updateProject(id, req.body);
    if (!item) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }
    res.json({ success: true, data: item });
  }

  deleteProject(req: Request, res: Response): void {
    const id = String(req.params.id);
    const deleted = portfolioService.deleteProject(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  }

  // Experience
  getExperiences(_req: Request, res: Response): void {
    const list = portfolioService.getExperiences();
    res.json({ success: true, data: list });
  }

  addExperience(req: Request, res: Response): void {
    const item = portfolioService.addExperience(req.body);
    res.status(201).json({ success: true, data: item });
  }

  updateExperience(req: Request, res: Response): void {
    const id = String(req.params.id);
    const item = portfolioService.updateExperience(id, req.body);
    if (!item) {
      res.status(404).json({ success: false, error: 'Experience record not found' });
      return;
    }
    res.json({ success: true, data: item });
  }

  deleteExperience(req: Request, res: Response): void {
    const id = String(req.params.id);
    const deleted = portfolioService.deleteExperience(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Experience record not found' });
      return;
    }
    res.json({ success: true, message: 'Experience record deleted successfully' });
  }

  // Achievements
  getAchievements(_req: Request, res: Response): void {
    const list = portfolioService.getAchievements();
    res.json({ success: true, data: list });
  }

  addAchievement(req: Request, res: Response): void {
    const item = portfolioService.addAchievement(req.body);
    res.status(201).json({ success: true, data: item });
  }

  deleteAchievement(req: Request, res: Response): void {
    const id = String(req.params.id);
    const deleted = portfolioService.deleteAchievement(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Achievement not found' });
      return;
    }
    res.json({ success: true, message: 'Achievement deleted successfully' });
  }

  // Publications
  getPublications(_req: Request, res: Response): void {
    const list = portfolioService.getPublications();
    res.json({ success: true, data: list });
  }

  addPublication(req: Request, res: Response): void {
    const item = portfolioService.addPublication(req.body);
    res.status(201).json({ success: true, data: item });
  }

  deletePublication(req: Request, res: Response): void {
    const id = String(req.params.id);
    const deleted = portfolioService.deletePublication(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Publication not found' });
      return;
    }
    res.json({ success: true, message: 'Publication deleted successfully' });
  }

  // Languages
  getLanguages(_req: Request, res: Response): void {
    const list = portfolioService.getLanguages();
    res.json({ success: true, data: list });
  }

  addLanguage(req: Request, res: Response): void {
    const item = portfolioService.addLanguage(req.body);
    res.status(201).json({ success: true, data: item });
  }

  deleteLanguage(req: Request, res: Response): void {
    const id = String(req.params.id);
    const deleted = portfolioService.deleteLanguage(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Language not found' });
      return;
    }
    res.json({ success: true, message: 'Language deleted successfully' });
  }

  // Export Portfolio JSON
  exportPortfolioJson(_req: Request, res: Response): void {
    const data = portfolioService.getCompletePortfolio();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="portfolio_backup.json"');
    res.send(JSON.stringify(data, null, 2));
  }

  // Import Portfolio JSON
  importPortfolioJson(req: Request, res: Response): void {
    try {
      const data = req.body;
      portfolioService.importPortfolio(data);
      res.json({ success: true, message: 'Portfolio imported successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Import failed' });
    }
  }
}
