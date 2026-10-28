import { describe, it, expect } from 'vitest';
import { PdfService } from '../src/services/pdf.service';
import { ResumeService } from '../src/services/resume.service';
import { PortfolioService } from '../src/services/portfolio.service';

describe('PdfService Vector Export', () => {
  const pdfService = new PdfService();
  const resumeService = new ResumeService();
  const portfolioService = new PortfolioService();

  it('renders a valid PDF buffer for Classic ATS template', async () => {
    const portfolio = portfolioService.getCompletePortfolio();
    const resume = resumeService.generateDefaultTailoredResume(portfolio, 'ai_ml');
    resume.template = 'classic_ats';

    const buffer = await pdfService.generateResumePdf(resume, portfolio);

    expect(buffer).toBeDefined();
    expect(buffer.length).toBeGreaterThan(1000);
    // Verify standard PDF header %PDF-1.
    const header = buffer.subarray(0, 5).toString('ascii');
    expect(header).toBe('%PDF-');
  });

  it('renders a valid PDF buffer for Modern Professional template', async () => {
    const portfolio = portfolioService.getCompletePortfolio();
    const resume = resumeService.generateDefaultTailoredResume(portfolio, 'frontend');
    resume.template = 'modern_professional';

    const buffer = await pdfService.generateResumePdf(resume, portfolio);

    expect(buffer).toBeDefined();
    expect(buffer.length).toBeGreaterThan(1000);
    const header = buffer.subarray(0, 5).toString('ascii');
    expect(header).toBe('%PDF-');
  });
});
