import express, { Express } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { portfolioRouter } from './routes/portfolio.routes';
import { jobRouter } from './routes/job.routes';
import { resumeRouter } from './routes/resume.routes';
import { sheetsRouter } from './routes/sheets.routes';
import { settingsRouter } from './routes/settings.routes';
import { healthRouter } from './routes/health.routes';
import { errorHandler } from './middleware/error.middleware';

export function createApp(): Express {
  const app = express();

  // CORS
  app.use(cors({
    origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }));

  // Rate Limiting (generous in development)
  const limiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests, please try again later.' },
  });
  app.use('/api/', limiter);

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  app.use('/api/health', healthRouter);
  app.use('/api/portfolio', portfolioRouter);
  app.use('/api/jobs', jobRouter);
  app.use('/api/resumes', resumeRouter);
  app.use('/api/sheets', sheetsRouter);
  app.use('/api/settings', settingsRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
