import { Router } from 'express';
import { ResumeController } from '../controllers/resume.controller';

export const resumeRouter = Router();
const controller = new ResumeController();

resumeRouter.get('/', (req, res) => controller.getResumes(req, res));
resumeRouter.post('/', (req, res) => controller.createResume(req, res));
resumeRouter.post('/generate-tailored', (req, res) => controller.generateTailored(req, res));
resumeRouter.get('/:id', (req, res) => controller.getResumeById(req, res));
resumeRouter.put('/:id', (req, res) => controller.updateResume(req, res));
resumeRouter.delete('/:id', (req, res) => controller.deleteResume(req, res));
resumeRouter.get('/:id/pdf', (req, res) => controller.downloadPdf(req, res));
