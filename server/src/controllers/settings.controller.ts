import { Request, Response } from 'express';
import { config } from '../config';
import { getDatabase } from '../database/connection';
import { seedDatabase } from '../database/seed';
import { GoogleSheetsService } from '../services/sheets.service';
import { GeminiService } from '../services/gemini.service';

const sheetsService = new GoogleSheetsService();
const geminiService = new GeminiService();

export class SettingsController {
  getSystemStatus(_req: Request, res: Response): void {
    const db = getDatabase();

    const counts = {
      skills: (db.prepare('SELECT COUNT(*) as c FROM skills').get() as any)?.c || 0,
      projects: (db.prepare('SELECT COUNT(*) as c FROM projects').get() as any)?.c || 0,
      experiences: (db.prepare('SELECT COUNT(*) as c FROM experiences').get() as any)?.c || 0,
      education: (db.prepare('SELECT COUNT(*) as c FROM education').get() as any)?.c || 0,
      certifications: (db.prepare('SELECT COUNT(*) as c FROM certifications').get() as any)?.c || 0,
      resumes: (db.prepare('SELECT COUNT(*) as c FROM resume_documents').get() as any)?.c || 0,
      job_analyses: (db.prepare('SELECT COUNT(*) as c FROM job_analyses').get() as any)?.c || 0,
    };

    const hasProfile = Boolean(db.prepare('SELECT id FROM portfolio_profile LIMIT 1').get());

    res.json({
      success: true,
      data: {
        environment: config.nodeEnv,
        database: {
          path: config.databasePath,
          has_profile: hasProfile,
          record_counts: counts,
        },
        gemini: {
          is_configured: geminiService.isConfigured(),
          model: config.geminiModel,
        },
        sheets: sheetsService.getStatus(),
      },
    });
  }

  seedDemoData(_req: Request, res: Response): void {
    try {
      seedDatabase();
      res.json({
        success: true,
        message: 'Fictional demo portfolio data seeded successfully.',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to seed data' });
    }
  }

  resetDatabase(_req: Request, res: Response): void {
    try {
      const db = getDatabase();
      db.transaction(() => {
        db.prepare('DELETE FROM resume_sections').run();
        db.prepare('DELETE FROM resume_documents').run();
        db.prepare('DELETE FROM job_analyses').run();
        db.prepare('DELETE FROM project_skills').run();
        db.prepare('DELETE FROM projects').run();
        db.prepare('DELETE FROM experiences').run();
        db.prepare('DELETE FROM education').run();
        db.prepare('DELETE FROM skills').run();
        db.prepare('DELETE FROM certifications').run();
        db.prepare('DELETE FROM achievements').run();
        db.prepare('DELETE FROM publications').run();
        db.prepare('DELETE FROM languages').run();
        db.prepare('DELETE FROM portfolio_profile').run();
        db.prepare('DELETE FROM sheets_sync_logs').run();
      })();

      res.json({ success: true, message: 'All portfolio data has been reset to an empty state.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to reset database' });
    }
  }
}
