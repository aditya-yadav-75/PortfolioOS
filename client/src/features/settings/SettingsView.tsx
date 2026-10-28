import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Cpu,
  FileSpreadsheet,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { GlassPanel } from '../../components/ui/GlassPanel';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { api } from '../../lib/api';
import { useToast } from '../../components/ui/Toast';

export const SettingsView: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [resetting, setResetting] = useState(false);

  const { success, error, warning } = useToast();

  const loadStatus = async () => {
    try {
      setLoading(true);
      const data = await api.settings.getStatus();
      setStatus(data);
    } catch (err: any) {
      error('Failed to load system settings', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const res = await api.settings.seedDemo();
      success(res.message);
      loadStatus();
    } catch (err: any) {
      error('Failed to seed demo data', err.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('CAUTION: This will delete all records from the SQLite database! Continue?')) {
      return;
    }
    try {
      setResetting(true);
      const res = await api.settings.resetDatabase();
      warning(res.message);
      loadStatus();
    } catch (err: any) {
      error('Failed to reset database', err.message);
    } finally {
      setResetting(false);
    }
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await api.portfolio.importJson(parsed);
      success('Portfolio imported successfully!');
      loadStatus();
    } catch (err: any) {
      error('Import failed', err.message);
    }
  };

  const counts = status?.database?.record_counts || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Settings & System Diagnostics"
        badge="Administration"
        description="Environment parameters, API connectivity verification, sample database seeding, and JSON backup controls."
      />

      {/* Grid of Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gemini AI Status */}
        <GlassPanel className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Google Gemini API</h3>
            </div>
            <StatusIndicator
              status={status?.gemini?.is_configured ? 'active' : 'idle'}
              label={status?.gemini?.is_configured ? 'API Key Active' : 'Fallback Mode'}
            />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <span className="text-[#737987]">Configured Model</span>
              <span className="text-white font-mono">{status?.gemini?.model || 'gemini-1.5-flash'}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <span className="text-[#737987]">Environment Variable</span>
              <span className="text-white font-mono">GEMINI_API_KEY</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <span className="text-[#737987]">Deterministic Fallback</span>
              <span className="text-emerald-400 font-semibold">Enabled (Never halts)</span>
            </div>
          </div>
          <p className="text-[11px] text-[#A0A5B0] leading-relaxed">
            When GEMINI_API_KEY is not set or network is unreachable, PortfolioOS automatically switches to its deterministic keyword & qualification matcher.
          </p>
        </GlassPanel>

        {/* Database Status */}
        <GlassPanel className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">SQLite Relational Database</h3>
            </div>
            <StatusIndicator status="active" label="Connected (WAL)" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <span className="text-[#737987]">Database File</span>
              <span className="text-white font-mono truncate max-w-[200px]">
                {status?.database?.path || 'portfolio_os.db'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <span className="text-[#737987]">Skills / Projects</span>
              <span className="text-white font-mono">{counts.skills ?? 0} skills / {counts.projects ?? 0} projects</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <span className="text-[#737987]">Experiences / Education</span>
              <span className="text-white font-mono">{counts.experiences ?? 0} exp / {counts.education ?? 0} edu</span>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Demo Seeding & Reset Section */}
      <GlassPanel className="space-y-4">
        <div className="border-b border-white/10 pb-3">
          <h3 className="text-sm font-semibold text-white">Demo Data & Database State Controls</h3>
          <p className="text-xs text-[#A0A5B0] mt-0.5">
            Seed fictional student portfolio data for demonstration, or reset all tables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-400/30 text-xs font-semibold shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all disabled:opacity-50"
          >
            {seeding ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
            Seed Complete Fictional Demo Data
          </button>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-all disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset Database to Empty
          </button>
        </div>
      </GlassPanel>

      {/* JSON Backup & Restore */}
      <GlassPanel className="space-y-4">
        <div className="border-b border-white/10 pb-3">
          <h3 className="text-sm font-semibold text-white">Full JSON Portfolio Backup & Restore</h3>
          <p className="text-xs text-[#A0A5B0] mt-0.5">
            Export a full JSON snapshot of all portfolio records or restore an existing backup.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={api.portfolio.getExportUrl()}
            download="portfolio_os_backup.json"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white border border-white/10 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            Download Complete JSON Backup
          </a>

          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white border border-white/10 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            Restore from JSON File
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
        </div>
      </GlassPanel>
    </div>
  );
};
