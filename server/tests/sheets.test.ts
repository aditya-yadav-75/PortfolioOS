import { describe, it, expect } from 'vitest';
import { GoogleSheetsService } from '../src/services/sheets.service';
import { PortfolioService } from '../src/services/portfolio.service';

describe('GoogleSheetsService Integration & Safety', () => {
  const sheetsService = new GoogleSheetsService();
  const portfolioService = new PortfolioService();

  it('correctly reports not_configured when credentials are missing', () => {
    const status = sheetsService.getStatus();
    expect(status).toBeDefined();
    expect(status.available_tabs).toContain('Skills');
    expect(status.available_tabs).toContain('Projects');
  });

  it('logs failed sync attempt intentionally without fake success', async () => {
    const portfolio = portfolioService.getCompletePortfolio();

    await expect(sheetsService.exportToSheets(portfolio, '')).rejects.toThrow();

    const logs = sheetsService.getSyncLogs(5);
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].status).toBe('FAILED');
    expect(logs[0].error_message).toBeDefined();
  });
});
