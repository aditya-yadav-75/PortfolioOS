import { Request, Response } from 'express';
import { GoogleSheetsService } from '../services/sheets.service';
import { PortfolioService } from '../services/portfolio.service';

const sheetsService = new GoogleSheetsService();
const portfolioService = new PortfolioService();

export class SheetsController {
  getStatus(_req: Request, res: Response): void {
    const status = sheetsService.getStatus();
    res.json({ success: true, data: status });
  }

  getSyncLogs(_req: Request, res: Response): void {
    const logs = sheetsService.getSyncLogs();
    res.json({ success: true, data: logs });
  }

  async exportToSheets(req: Request, res: Response): Promise<void> {
    try {
      const { spreadsheet_id } = req.body || {};
      const portfolio = portfolioService.getCompletePortfolio();
      const result = await sheetsService.exportToSheets(portfolio, spreadsheet_id);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to export to Google Sheets' });
    }
  }

  async importFromSheets(req: Request, res: Response): Promise<void> {
    try {
      const { spreadsheet_id } = req.body || {};
      const result = await sheetsService.importFromSheets(spreadsheet_id);

      // If imported skills, we can merge or update
      if (result.importedPortfolio.skills && result.importedPortfolio.skills.length > 0) {
        for (const skill of result.importedPortfolio.skills) {
          portfolioService.addSkill({
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency,
            years_experience: skill.years_experience,
          });
        }
      }

      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to import from Google Sheets' });
    }
  }
}
