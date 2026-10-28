import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio.controller';
import { validateBody } from '../middleware/validation.middleware';
import {
  PortfolioProfileSchema,
  EducationSchema,
  SkillSchema,
  CertificationSchema,
  ProjectSchema,
  ExperienceSchema,
  AchievementSchema,
  PublicationSchema,
  LanguageSchema,
} from '@portfolio-os/shared';

export const portfolioRouter = Router();
const controller = new PortfolioController();

// Complete Portfolio & Backups
portfolioRouter.get('/', (req, res) => controller.getCompletePortfolio(req, res));
portfolioRouter.get('/export/json', (req, res) => controller.exportPortfolioJson(req, res));
portfolioRouter.post('/import/json', (req, res) => controller.importPortfolioJson(req, res));

// Profile
portfolioRouter.get('/profile', (req, res) => controller.getProfile(req, res));
portfolioRouter.put('/profile', validateBody(PortfolioProfileSchema), (req, res) => controller.updateProfile(req, res));

// Education
portfolioRouter.get('/education', (req, res) => controller.getEducationList(req, res));
portfolioRouter.post('/education', validateBody(EducationSchema), (req, res) => controller.addEducation(req, res));
portfolioRouter.put('/education/:id', (req, res) => controller.updateEducation(req, res));
portfolioRouter.delete('/education/:id', (req, res) => controller.deleteEducation(req, res));

// Skills
portfolioRouter.get('/skills', (req, res) => controller.getSkills(req, res));
portfolioRouter.post('/skills', validateBody(SkillSchema), (req, res) => controller.addSkill(req, res));
portfolioRouter.put('/skills/:id', (req, res) => controller.updateSkill(req, res));
portfolioRouter.delete('/skills/:id', (req, res) => controller.deleteSkill(req, res));

// Certifications
portfolioRouter.get('/certifications', (req, res) => controller.getCertifications(req, res));
portfolioRouter.post('/certifications', validateBody(CertificationSchema), (req, res) => controller.addCertification(req, res));
portfolioRouter.put('/certifications/:id', (req, res) => controller.updateCertification(req, res));
portfolioRouter.delete('/certifications/:id', (req, res) => controller.deleteCertification(req, res));

// Projects
portfolioRouter.get('/projects', (req, res) => controller.getProjects(req, res));
portfolioRouter.post('/projects', validateBody(ProjectSchema), (req, res) => controller.addProject(req, res));
portfolioRouter.put('/projects/:id', (req, res) => controller.updateProject(req, res));
portfolioRouter.delete('/projects/:id', (req, res) => controller.deleteProject(req, res));

// Experience
portfolioRouter.get('/experience', (req, res) => controller.getExperiences(req, res));
portfolioRouter.post('/experience', validateBody(ExperienceSchema), (req, res) => controller.addExperience(req, res));
portfolioRouter.put('/experience/:id', (req, res) => controller.updateExperience(req, res));
portfolioRouter.delete('/experience/:id', (req, res) => controller.deleteExperience(req, res));

// Achievements
portfolioRouter.get('/achievements', (req, res) => controller.getAchievements(req, res));
portfolioRouter.post('/achievements', validateBody(AchievementSchema), (req, res) => controller.addAchievement(req, res));
portfolioRouter.delete('/achievements/:id', (req, res) => controller.deleteAchievement(req, res));

// Publications
portfolioRouter.get('/publications', (req, res) => controller.getPublications(req, res));
portfolioRouter.post('/publications', validateBody(PublicationSchema), (req, res) => controller.addPublication(req, res));
portfolioRouter.delete('/publications/:id', (req, res) => controller.deletePublication(req, res));

// Languages
portfolioRouter.get('/languages', (req, res) => controller.getLanguages(req, res));
portfolioRouter.post('/languages', validateBody(LanguageSchema), (req, res) => controller.addLanguage(req, res));
portfolioRouter.delete('/languages/:id', (req, res) => controller.deleteLanguage(req, res));
