import { google, sheets_v4 } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { getDatabase } from '../database/connection';
import {
  SheetsIntegrationStatus,
  SheetsSyncLog,
  CompletePortfolio,
  PortfolioProfile,
  Education,
  Skill,
  Project,
  Experience,
  Certification,
  Achievement
} from '@portfolio-os/shared';

export class GoogleSheetsService {
  private db = getDatabase();

  private getAuthClient(): any | null {
    try {
      if (config.googleServiceAccountJson) {
        const credentials = JSON.parse(config.googleServiceAccountJson);
        return new google.auth.JWT({
          email: credentials.client_email,
          key: credentials.private_key,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
      }

      if (config.googleServiceAccountKeyPath) {
        const resolvedPath = path.isAbsolute(config.googleServiceAccountKeyPath)
          ? config.googleServiceAccountKeyPath
          : path.resolve(process.cwd(), config.googleServiceAccountKeyPath);

        if (fs.existsSync(resolvedPath)) {
          const content = fs.readFileSync(resolvedPath, 'utf8');
          const credentials = JSON.parse(content);
          return new google.auth.JWT({
            email: credentials.client_email,
            key: credentials.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          });
        }
      }
    } catch (err) {
      console.warn('Failed to initialize Google Sheets Auth Client:', err);
    }
    return null;
  }

  getStatus(): SheetsIntegrationStatus {
    const isConfigured = Boolean(
      (config.googleServiceAccountJson || config.googleServiceAccountKeyPath) &&
      config.googleSpreadsheetId
    );

    // Get last sync log
    const lastLog = this.db.prepare('SELECT * FROM sheets_sync_logs ORDER BY timestamp DESC LIMIT 1').get() as any;

    let serviceAccountEmail: string | undefined;
    try {
      if (config.googleServiceAccountJson) {
        serviceAccountEmail = JSON.parse(config.googleServiceAccountJson).client_email;
      } else if (config.googleServiceAccountKeyPath && fs.existsSync(config.googleServiceAccountKeyPath)) {
        serviceAccountEmail = JSON.parse(fs.readFileSync(config.googleServiceAccountKeyPath, 'utf8')).client_email;
      }
    } catch {
      // ignore
    }

    return {
      is_configured: isConfigured,
      spreadsheet_id: config.googleSpreadsheetId || undefined,
      spreadsheet_title: config.googleSpreadsheetId ? `Spreadsheet (${config.googleSpreadsheetId.slice(0, 8)}...)` : undefined,
      spreadsheet_url: config.googleSpreadsheetId ? `https://docs.google.com/spreadsheets/d/${config.googleSpreadsheetId}/edit` : undefined,
      service_account_email: serviceAccountEmail,
      last_sync_at: lastLog ? lastLog.timestamp : undefined,
      last_sync_status: lastLog ? lastLog.status : undefined,
      available_tabs: ['Profile', 'Education', 'Skills', 'Projects', 'Experience', 'Certifications', 'Achievements'],
    };
  }

  getSyncLogs(limit: number = 20): SheetsSyncLog[] {
    const rows = this.db.prepare('SELECT * FROM sheets_sync_logs ORDER BY timestamp DESC LIMIT ?').all(limit) as any[];
    return rows.map(r => ({
      id: r.id,
      action: r.action,
      status: r.status,
      items_synced: r.items_synced,
      tab_name: r.tab_name || undefined,
      error_message: r.error_message || undefined,
      spreadsheet_id: r.spreadsheet_id,
      timestamp: r.timestamp,
    }));
  }

  logSync(
    action: 'export_all' | 'export_tab' | 'import_all' | 'import_tab',
    status: 'SUCCESS' | 'FAILED' | 'WARNING',
    itemsSynced: number,
    spreadsheetId: string,
    tabName?: string,
    errorMessage?: string
  ): SheetsSyncLog {
    const id = uuidv4();
    const now = new Date().toISOString();

    this.db.prepare(`
      INSERT INTO sheets_sync_logs (id, action, status, items_synced, tab_name, error_message, spreadsheet_id, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, action, status, itemsSynced, tabName || null, errorMessage || null, spreadsheetId, now);

    return {
      id,
      action,
      status,
      items_synced: itemsSynced,
      tab_name: tabName,
      error_message: errorMessage,
      spreadsheet_id: spreadsheetId,
      timestamp: now,
    };
  }

  async exportToSheets(portfolio: CompletePortfolio, targetSpreadsheetId?: string): Promise<{ success: boolean; itemsSynced: number; message: string }> {
    const sheetId = targetSpreadsheetId || config.googleSpreadsheetId;
    if (!sheetId) {
      const msg = 'Google Spreadsheet ID is not configured. Please set GOOGLE_SPREADSHEET_ID in settings or environment.';
      this.logSync('export_all', 'FAILED', 0, 'none', undefined, msg);
      throw new Error(msg);
    }

    const auth = this.getAuthClient();
    if (!auth) {
      const msg = 'Google Service Account credentials missing or invalid. Please configure Google Service Account in settings or .env.';
      this.logSync('export_all', 'FAILED', 0, sheetId, undefined, msg);
      throw new Error(msg);
    }

    const sheets = google.sheets({ version: 'v4', auth });

    try {
      // 1. Ensure required tabs exist
      const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
      const existingSheetTitles = (meta.data.sheets || []).map(s => s.properties?.title || '');

      const requiredTabs = ['Profile', 'Education', 'Skills', 'Projects', 'Experience', 'Certifications', 'Achievements'];
      const addSheetRequests: sheets_v4.Schema$Request[] = [];

      for (const tab of requiredTabs) {
        if (!existingSheetTitles.includes(tab)) {
          addSheetRequests.push({
            addSheet: {
              properties: { title: tab },
            },
          });
        }
      }

      if (addSheetRequests.length > 0) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: sheetId,
          requestBody: { requests: addSheetRequests },
        });
      }

      let totalSynced = 0;

      // 2. Export Profile Tab
      if (portfolio.profile) {
        const profileRows = [
          ['id', 'full_name', 'headline', 'email', 'phone', 'location', 'website_url', 'github_url', 'linkedin_url', 'summary', 'career_objective', 'updated_at'],
          [
            portfolio.profile.id,
            portfolio.profile.full_name,
            portfolio.profile.headline,
            portfolio.profile.email,
            portfolio.profile.phone || '',
            portfolio.profile.location || '',
            portfolio.profile.website_url || '',
            portfolio.profile.github_url || '',
            portfolio.profile.linkedin_url || '',
            portfolio.profile.summary,
            portfolio.profile.career_objective || '',
            portfolio.profile.updated_at,
          ]
        ];
        await sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: 'Profile!A1',
          valueInputOption: 'RAW',
          requestBody: { values: profileRows },
        });
        totalSynced += 1;
      }

      // 3. Export Skills Tab
      const skillsRows = [
        ['id', 'name', 'category', 'proficiency', 'years_experience', 'updated_at'],
        ...portfolio.skills.map(s => [s.id, s.name, s.category, s.proficiency, s.years_experience ?? '', s.updated_at])
      ];
      await sheets.spreadsheets.values.clear({ spreadsheetId: sheetId, range: 'Skills!A:F' });
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Skills!A1',
        valueInputOption: 'RAW',
        requestBody: { values: skillsRows },
      });
      totalSynced += portfolio.skills.length;

      // 4. Export Education Tab
      const eduRows = [
        ['id', 'institution', 'degree', 'field_of_study', 'start_date', 'end_date', 'is_current', 'gpa', 'honors', 'location', 'description', 'updated_at'],
        ...portfolio.education.map(e => [
          e.id, e.institution, e.degree, e.field_of_study, e.start_date, e.end_date || '', e.is_current ? 'TRUE' : 'FALSE',
          e.gpa || '', e.honors || '', e.location || '', e.description || '', e.updated_at
        ])
      ];
      await sheets.spreadsheets.values.clear({ spreadsheetId: sheetId, range: 'Education!A:L' });
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Education!A1',
        valueInputOption: 'RAW',
        requestBody: { values: eduRows },
      });
      totalSynced += portfolio.education.length;

      // 5. Export Projects Tab
      const projRows = [
        ['id', 'title', 'subtitle', 'role', 'start_date', 'end_date', 'description', 'bullet_points', 'technologies', 'github_url', 'live_url', 'featured', 'updated_at'],
        ...portfolio.projects.map(p => [
          p.id, p.title, p.subtitle || '', p.role || '', p.start_date || '', p.end_date || '', p.description,
          p.bullet_points.join(' | '), p.technologies.join(', '), p.github_url || '', p.live_url || '', p.featured ? 'TRUE' : 'FALSE', p.updated_at
        ])
      ];
      await sheets.spreadsheets.values.clear({ spreadsheetId: sheetId, range: 'Projects!A:M' });
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Projects!A1',
        valueInputOption: 'RAW',
        requestBody: { values: projRows },
      });
      totalSynced += portfolio.projects.length;

      // 6. Export Experience Tab
      const expRows = [
        ['id', 'company', 'role', 'location', 'employment_type', 'start_date', 'end_date', 'is_current', 'description', 'bullet_points', 'technologies', 'updated_at'],
        ...portfolio.experiences.map(e => [
          e.id, e.company, e.role, e.location || '', e.employment_type, e.start_date, e.end_date || '',
          e.is_current ? 'TRUE' : 'FALSE', e.description, e.bullet_points.join(' | '), (e.technologies || []).join(', '), e.updated_at
        ])
      ];
      await sheets.spreadsheets.values.clear({ spreadsheetId: sheetId, range: 'Experience!A:L' });
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Experience!A1',
        valueInputOption: 'RAW',
        requestBody: { values: expRows },
      });
      totalSynced += portfolio.experiences.length;

      // 7. Export Certifications Tab
      const certRows = [
        ['id', 'title', 'issuer', 'issue_date', 'expiration_date', 'credential_id', 'credential_url', 'updated_at'],
        ...portfolio.certifications.map(c => [
          c.id, c.title, c.issuer, c.issue_date, c.expiration_date || '', c.credential_id || '', c.credential_url || '', c.updated_at
        ])
      ];
      await sheets.spreadsheets.values.clear({ spreadsheetId: sheetId, range: 'Certifications!A:H' });
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Certifications!A1',
        valueInputOption: 'RAW',
        requestBody: { values: certRows },
      });
      totalSynced += portfolio.certifications.length;

      // 8. Export Achievements Tab
      const achRows = [
        ['id', 'title', 'issuer', 'date', 'description', 'category', 'updated_at'],
        ...portfolio.achievements.map(a => [
          a.id, a.title, a.issuer, a.date, a.description || '', a.category || '', a.updated_at
        ])
      ];
      await sheets.spreadsheets.values.clear({ spreadsheetId: sheetId, range: 'Achievements!A:G' });
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Achievements!A1',
        valueInputOption: 'RAW',
        requestBody: { values: achRows },
      });
      totalSynced += portfolio.achievements.length;

      this.logSync('export_all', 'SUCCESS', totalSynced, sheetId);
      return { success: true, itemsSynced: totalSynced, message: `Successfully exported ${totalSynced} records to Google Sheets.` };
    } catch (err: any) {
      const errMsg = err?.message || 'Unknown Google Sheets API error during export';
      this.logSync('export_all', 'FAILED', 0, sheetId, undefined, errMsg);
      throw new Error(errMsg);
    }
  }

  async importFromSheets(targetSpreadsheetId?: string): Promise<{ success: boolean; importedPortfolio: Partial<CompletePortfolio>; message: string }> {
    const sheetId = targetSpreadsheetId || config.googleSpreadsheetId;
    if (!sheetId) {
      throw new Error('Google Spreadsheet ID is not configured.');
    }

    const auth = this.getAuthClient();
    if (!auth) {
      throw new Error('Google Service Account credentials missing or invalid.');
    }

    const sheets = google.sheets({ version: 'v4', auth });
    const imported: Partial<CompletePortfolio> = {};
    let count = 0;

    try {
      // Import Skills
      const skillsRes = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'Skills!A2:F' });
      const skillRows = skillsRes.data.values || [];
      imported.skills = skillRows.map(row => ({
        id: row[0] || uuidv4(),
        name: row[1] || 'Unknown Skill',
        category: (row[2] as any) || 'Languages',
        proficiency: (row[3] as any) || 'Intermediate',
        years_experience: row[4] ? parseFloat(row[4]) : undefined,
        created_at: new Date().toISOString(),
        updated_at: row[5] || new Date().toISOString(),
      }));
      count += imported.skills.length;

      this.logSync('import_all', 'SUCCESS', count, sheetId);
      return {
        success: true,
        importedPortfolio: imported,
        message: `Imported ${count} records successfully from Google Sheets.`,
      };
    } catch (err: any) {
      const msg = err?.message || 'Failed to import from Google Sheets';
      this.logSync('import_all', 'FAILED', 0, sheetId, undefined, msg);
      throw new Error(msg);
    }
  }
}
