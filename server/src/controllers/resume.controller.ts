import { Request, Response } from 'express';
import { ResumeService } from '../services/resume.service';
import { PortfolioService } from '../services/portfolio.service';
import { PdfService } from '../services/pdf.service';

const resumeService = new ResumeService();
const portfolioService = new PortfolioService();
const pdfService = new PdfService();

export class ResumeController {
  getResumes(_req: Request, res: Response): void {
    const resumes = resumeService.getResumes();
    res.json({ success: true, data: resumes });
  }

  getResumeById(req: Request, res: Response): void {
    const id = String(req.params.id);
    const doc = resumeService.getResumeById(id);
    if (!doc) {
      res.status(404).json({ success: false, error: 'Resume not found' });
      return;
    }
    res.json({ success: true, data: doc });
  }

  createResume(req: Request, res: Response): void {
    const doc = resumeService.createResume(req.body);
    res.status(201).json({ success: true, data: doc });
  }

  updateResume(req: Request, res: Response): void {
    const id = String(req.params.id);
    const doc = resumeService.updateResume(id, req.body);
    if (!doc) {
      res.status(404).json({ success: false, error: 'Resume not found' });
      return;
    }
    res.json({ success: true, data: doc });
  }

  deleteResume(req: Request, res: Response): void {
    const id = String(req.params.id);
    const deleted = resumeService.deleteResume(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Resume not found' });
      return;
    }
    res.json({ success: true, message: 'Resume deleted successfully' });
  }

  generateTailored(req: Request, res: Response): void {
    const { target_role } = req.body;
    const portfolio = portfolioService.getCompletePortfolio();
    const roleKey = target_role === 'frontend' || target_role === 'ai_ml' ? target_role : 'general';
    const doc = resumeService.generateDefaultTailoredResume(portfolio, roleKey);
    res.status(201).json({ success: true, data: doc });
  }

  async downloadPdf(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const resume = resumeService.getResumeById(id);
      if (!resume) {
        res.status(404).json({ success: false, error: 'Resume not found' });
        return;
      }

      const portfolio = portfolioService.getCompletePortfolio();
      const pdfBuffer = await pdfService.generateResumePdf(resume, portfolio);

      const candidateName = portfolio.profile?.full_name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Candidate';
      const roleName = resume.target_role.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${candidateName}_${roleName}_Resume.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (err: any) {
      console.error('PDF Generation Controller Error:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to generate PDF' });
    }
  }
}
