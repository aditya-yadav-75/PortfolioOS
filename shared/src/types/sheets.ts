export type SheetsSyncAction = 'export_all' | 'export_tab' | 'import_all' | 'import_tab';
export type SheetsSyncStatus = 'idle' | 'in_progress' | 'success' | 'failed' | 'not_configured';

export interface SheetTabInfo {
  name: string;
  rowCount: number;
  lastSyncedAt?: string;
}

export interface SheetsSyncLog {
  id: string;
  action: SheetsSyncAction;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  items_synced: number;
  tab_name?: string;
  error_message?: string;
  spreadsheet_id: string;
  timestamp: string;
}

export interface SheetsIntegrationStatus {
  is_configured: boolean;
  spreadsheet_id?: string;
  spreadsheet_title?: string;
  spreadsheet_url?: string;
  service_account_email?: string;
  last_sync_at?: string;
  last_sync_status?: 'SUCCESS' | 'FAILED' | 'WARNING';
  available_tabs: string[];
}
