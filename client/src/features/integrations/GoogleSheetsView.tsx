import React, { useState, useEffect } from 'react';
import {
  Sheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  KeyRound,
  FileSpreadsheet,
} from 'lucide-react';
import { GlassPanel } from '../../components/ui/GlassPanel';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { SyncStatus } from './SyncStatus';
import { api } from '../../lib/api';
import { useToast } from '../../components/ui/Toast';
import { SheetsIntegrationStatus, SheetsSyncLog } from '@portfolio-os/shared';

export const GoogleSheetsView: React.FC = () => {
  const [status, setStatus] = useState<SheetsIntegrationStatus | null>(null);
  const [logs, setLogs] = useState<SheetsSyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [customSheetId, setCustomSheetId] = useState('');

  const { success, error, info } = useToast();

  const loadStatusAndLogs = async () => {
    try {
      setLoading(true);
      const [st, lg] = await Promise.all([
        api.sheets.getStatus(),
        api.sheets.getLogs(),
      ]);
      setStatus(st);
      setLogs(lg);
      if (st.spreadsheet_id) setCustomSheetId(st.spreadsheet_id);
    } catch (err: any) {
      error('Failed to load Google Sheets info', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatusAndLogs();
  }, []);

  const handleExport = async () => {
    try {
      setSyncing(true);
      const res = await api.sheets.export(customSheetId || undefined);
      success(res.message);
      loadStatusAndLogs();
    } catch (err: any) {
      error('Export failed', err.message);
      loadStatusAndLogs();
    } finally {
      setSyncing(false);
    }
  };

  const handleImport = async () => {
    try {
      setSyncing(true);
      const res = await api.sheets.import(customSheetId || undefined);
      success(res.message);
      loadStatusAndLogs();
    } catch (err: any) {
      error('Import failed', err.message);
      loadStatusAndLogs();
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Google Sheets Integration"
        badge="Bi-Directional Sync"
        description="Synchronize your portfolio database with Google Sheets for external review, bulk tabular editing, and multi-sheet backup."
      />

      {/* Connection & Configuration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassPanel className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Spreadsheet Connection</h3>
                <div className="text-xs text-[#A0A5B0] mt-0.5">
                  Primary editable source: <span className="text-emerald-400 font-medium">SQLite Database</span>
                </div>
              </div>
            </div>
            <StatusIndicator
              status={status?.is_configured ? 'active' : 'warning'}
              label={status?.is_configured ? 'Configured' : 'Setup Required'}
            />
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-[#737987] uppercase tracking-wide mb-1">
                Target Google Spreadsheet ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSheetId}
                  onChange={(e) => setCustomSheetId(e.target.value)}
                  placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="flex-1 px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
                />
                {status?.spreadsheet_url && (
                  <a
                    href={status.spreadsheet_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-white border border-white/10"
                  >
                    Open Sheet <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                  </a>
                )}
              </div>
              <p className="text-[10px] text-[#737987] mt-1">
                Found in spreadsheet URL: https://docs.google.com/spreadsheets/d/<b>&lt;SPREADSHEET_ID&gt;</b>/edit
              </p>
            </div>

            {status?.service_account_email && (
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                <div className="text-[#737987] text-[10px] uppercase tracking-wide font-medium">
                  Service Account Email (Share sheet with Editor access)
                </div>
                <div className="text-sky-300 font-mono mt-0.5 select-all">
                  {status.service_account_email}
                </div>
              </div>
            )}

            {/* Sync Trigger Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleExport}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-400/30 text-xs font-semibold shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all disabled:opacity-50"
              >
                {syncing ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Export All Tabs to Sheets
              </button>
              <button
                onClick={handleImport}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 text-xs font-medium transition-all disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Import / Refresh from Sheets
              </button>
            </div>
          </div>
        </GlassPanel>

        {/* Tab Structure & Safe Mapping Policy */}
        <GlassPanel className="space-y-3">
          <div className="border-b border-white/10 pb-2">
            <h4 className="text-xs font-semibold text-white">Worksheet Tabs Schema</h4>
            <p className="text-[10px] text-[#737987]">Stable row IDs prevent duplicate appends</p>
          </div>

          <ul className="space-y-1.5 text-xs">
            {(status?.available_tabs || []).map((tab) => (
              <li key={tab} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="font-medium text-white">{tab} Tab</span>
                <span className="text-[10px] font-mono text-emerald-400">Column A ID</span>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </div>

      {/* Sync Audit Logs */}
      <GlassPanel className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Synchronization Audit Logs</h3>
            <p className="text-xs text-[#A0A5B0] mt-0.5">
              Live API response logs with error details and record counts.
            </p>
          </div>
          <button
            onClick={loadStatusAndLogs}
            className="flex items-center gap-1 text-xs text-[#A0A5B0] hover:text-white"
          >
            <RotateCcw className="w-3 h-3" /> Refresh Logs
          </button>
        </div>

        <SyncStatus logs={logs} />
      </GlassPanel>

      {/* Step-by-Step Configuration Guide */}
      <GlassPanel className="space-y-3 border-sky-500/20 bg-sky-500/[0.02]">
        <h4 className="text-xs font-semibold text-sky-400 flex items-center gap-2">
          <KeyRound className="w-4 h-4" />
          Google Cloud Service Account Setup Instructions
        </h4>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs text-[#A0A5B0] leading-relaxed">
          <li>Create a Google Cloud Project in <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">Google Cloud Console</a>.</li>
          <li>Enable the <b>Google Sheets API</b> in APIs & Services.</li>
          <li>Create a <b>Service Account</b> and generate a JSON Key.</li>
          <li>Set <code className="text-white bg-black/40 px-1 py-0.5 rounded">GOOGLE_SERVICE_ACCOUNT_KEY_PATH</code> in <code className="text-white bg-black/40 px-1 py-0.5 rounded">.env</code> to your JSON file path.</li>
          <li>Create a new Google Sheet and share it with the service account's email with <b>Editor</b> permissions.</li>
        </ol>
      </GlassPanel>
    </div>
  );
};
