import { Request, Response } from 'express';
import { GeminiService } from '../services/gemini.service';
import { PortfolioService } from '../services/portfolio.service';

const geminiService = new GeminiService();
const portfolioService = new PortfolioService();

export class JobController {
  async analyzeJob(req: Request, res: Response): Promise<void> {
    try {
      const { job_description, job_title, company_name, save_analysis } = req.body;
      const portfolio = portfolioService.getCompletePortfolio();

      const result = await geminiService.analyzeJobDescription(
        job_description,
        portfolio,
        job_title,
        company_name
      );

      let savedId: string | undefined;
      if (save_analysis !== false) {
        const saved = geminiService.saveJobAnalysis(
          job_description,
          result,
          job_title,
          company_name
        );
        savedId = saved.id;
      }

      res.json({
        success: true,
        data: {
          ...result,
          saved_analysis_id: savedId,
        },
      });
    } catch (err: any) {
      console.error('Job analysis controller error:', err);
      res.status(500).json({ success: false, error: err.message || 'Job analysis failed' });
    }
  }

  async rewriteSummary(req: Request, res: Response): Promise<void> {
    try {
      const { current_summary, job_title, target_keywords, key_achievements } = req.body;
      const rewritten = await geminiService.rewriteProfessionalSummary(
        current_summary,
        job_title,
        target_keywords || [],
        key_achievements || []
      );
      res.json({ success: true, data: { rewritten_summary: rewritten } });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Rewrite failed' });
    }
  }

  async rewriteBullet(req: Request, res: Response): Promise<void> {
    try {
      const { bullet, role, target_skill_or_keyword } = req.body;
      const rewritten = await geminiService.rewriteProjectBullet(
        bullet,
        role,
        target_skill_or_keyword
      );
      res.json({ success: true, data: { rewritten_bullet: rewritten } });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Bullet rewrite failed' });
    }
  }

  getSavedAnalyses(_req: Request, res: Response): void {
    const list = geminiService.getSavedAnalyses();
    res.json({ success: true, data: list });
  }

  getAnalysisById(req: Request, res: Response): void {
    const id = String(req.params.id);
    const item = geminiService.getAnalysisById(id);
    if (!item) {
      res.status(404).json({ success: false, error: 'Job analysis not found' });
      return;
    }
    res.json({ success: true, data: item });
  }

  deleteAnalysis(req: Request, res: Response): void {
    const id = String(req.params.id);
    const deleted = geminiService.deleteAnalysis(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Job analysis not found' });
      return;
    }
    res.json({ success: true, message: 'Analysis deleted successfully' });
  }
}
