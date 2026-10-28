import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { validateBody } from '../middleware/validation.middleware';
import {
  AnalyzeJobRequestSchema,
  RewriteSummaryRequestSchema,
  RewriteProjectBulletRequestSchema,
} from '@portfolio-os/shared';

export const jobRouter = Router();
const controller = new JobController();

jobRouter.post('/analyze', validateBody(AnalyzeJobRequestSchema), (req, res) => controller.analyzeJob(req, res));
jobRouter.post('/rewrite-summary', validateBody(RewriteSummaryRequestSchema), (req, res) => controller.rewriteSummary(req, res));
jobRouter.post('/rewrite-bullet', validateBody(RewriteProjectBulletRequestSchema), (req, res) => controller.rewriteBullet(req, res));
jobRouter.get('/saved', (req, res) => controller.getSavedAnalyses(req, res));
jobRouter.get('/saved/:id', (req, res) => controller.getAnalysisById(req, res));
jobRouter.delete('/saved/:id', (req, res) => controller.deleteAnalysis(req, res));
