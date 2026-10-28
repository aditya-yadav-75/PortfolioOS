import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  FileText,
  FolderGit2,
  CheckCircle2,
  Download,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Award,
} from 'lucide-react';
import { GlassPanel } from '../../components/ui/GlassPanel';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { api } from '../../lib/api';
import { useToast } from '../../components/ui/Toast';
import { NavigationTab } from '../../components/ui/GlassNavigation';
import { ResumeVersionSummary } from '@portfolio-os/shared';

interface OverviewViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenResume?: (id: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate, onOpenResume }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [resumes, setResumes] = useState<ResumeVersionSummary[]>([]);
  const { success, error } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [sysStatus, resumeList] = await Promise.all([
        api.settings.getStatus(),
        api.resumes.getAll(),
      ]);
      setStats(sysStatus);
      setResumes(resumeList);
    } catch (err: any) {
      error('Failed to load overview data', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeedDemo = async () => {
    try {
      await api.settings.seedDemo();
      success('Fictional demo data seeded successfully!');
      loadData();
    } catch (err: any) {
      error('Failed to seed demo data', err.message);
    }
  };

  const counts = stats?.database?.record_counts || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Workspace Overview"
        badge="Spatial OS"
        description="Your centralized career database and evidence-backed dynamic resume synthesis engine."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedDemo}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-[#F3F4F6] border border-white/10 transition-colors"
            >
              Seed Demo Portfolio
            </button>
            <button
              onClick={() => onNavigate('job-matcher')}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-400/30 text-xs font-medium transition-colors shadow-[0_0_15px_rgba(56,189,248,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Analyze Job Match
            </button>
          </div>
        }
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassPanel variant="card" className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#737987] font-medium uppercase tracking-wider">Skills</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white">{counts.skills ?? 0}</div>
            <div className="text-[11px] text-[#A0A5B0] mt-0.5">Categorized technical & soft skills</div>
          </div>
        </GlassPanel>

        <GlassPanel variant="card" className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#737987] font-medium uppercase tracking-wider">Projects</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white">{counts.projects ?? 0}</div>
            <div className="text-[11px] text-[#A0A5B0] mt-0.5">Evidence-backed case studies</div>
          </div>
        </GlassPanel>

        <GlassPanel variant="card" className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#737987] font-medium uppercase tracking-wider">Experience</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white">{counts.experiences ?? 0}</div>
            <div className="text-[11px] text-[#A0A5B0] mt-0.5">Internships & technical roles</div>
          </div>
        </GlassPanel>

        <GlassPanel variant="card" className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#737987] font-medium uppercase tracking-wider">Active Resumes</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white">{counts.resumes ?? 0}</div>
            <div className="text-[11px] text-[#A0A5B0] mt-0.5">Tailored resume variants</div>
          </div>
        </GlassPanel>
      </div>

      {/* Quick Launch & AI Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Tailoring Actions */}
        <GlassPanel className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">One-Click Resume Tailoring</h3>
              <p className="text-xs text-[#A0A5B0] mt-0.5">Generate role-tailored resumes from verified portfolio evidence.</p>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-[#A0A5B0]">Dual-Role Ready</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div
              onClick={() => onNavigate('resume-studio')}
              className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-sky-400/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white group-hover:text-sky-400 transition-colors">
                  Frontend Developer Intern
                </span>
                <ArrowRight className="w-4 h-4 text-[#737987] group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-[11px] text-[#A0A5B0] leading-relaxed">
                Highlights React, TypeScript, PulseUI design system, and Vanguard Tech Labs internship.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-sky-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Modern Professional Template
              </div>
            </div>

            <div
              onClick={() => onNavigate('resume-studio')}
              className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-sky-400/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white group-hover:text-sky-400 transition-colors">
                  AI / Machine Learning Intern
                </span>
                <ArrowRight className="w-4 h-4 text-[#737987] group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-[11px] text-[#A0A5B0] leading-relaxed">
                Highlights PyTorch, NeuroVision edge detection, DocuSphere RAG engine, and HackAI award.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-sky-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Classic ATS Template
              </div>
            </div>
          </div>
        </GlassPanel>

        {/* Integration & Engine Status */}
        <GlassPanel className="space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-semibold text-white">System Health & Engines</h3>
            <p className="text-xs text-[#A0A5B0] mt-0.5">Active services and runtime status.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-sky-400" />
                <div>
                  <div className="text-xs font-medium text-white">Gemini AI Engine</div>
                  <div className="text-[10px] text-[#737987]">
                    {stats?.gemini?.is_configured ? stats.gemini.model : 'Deterministic Fallback Active'}
                  </div>
                </div>
              </div>
              <StatusIndicator status={stats?.gemini?.is_configured ? 'active' : 'idle'} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-medium text-white">SQLite Relational DB</div>
                  <div className="text-[10px] text-[#737987]">WAL Mode • Foreign Keys Enabled</div>
                </div>
              </div>
              <StatusIndicator status="active" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-medium text-white">Google Sheets Sync</div>
                  <div className="text-[10px] text-[#737987]">
                    {stats?.sheets?.is_configured ? 'Configured' : 'Setup Required'}
                  </div>
                </div>
              </div>
              <StatusIndicator status={stats?.sheets?.is_configured ? 'active' : 'idle'} />
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Saved Resumes List */}
      <GlassPanel className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Generated Resume Versions</h3>
            <p className="text-xs text-[#A0A5B0] mt-0.5">Named resume variants stored with complete section selections.</p>
          </div>
          <button
            onClick={() => onNavigate('resume-studio')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
          >
            Open Resume Studio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#737987]">
            No resume versions saved yet. Click "Open Resume Studio" or "Seed Demo Portfolio" above.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {resumes.map((r) => (
              <div key={r.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs font-medium text-white truncate">{r.name}</div>
                  <div className="text-[11px] text-[#737987] flex items-center gap-2 mt-0.5">
                    <span>Target: {r.target_role}</span>
                    <span>•</span>
                    <span className="capitalize">{r.template.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={api.resumes.getPdfDownloadUrl(r.id)}
                    download
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white border border-white/10 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    Download PDF
                  </a>
                  <button
                    onClick={() => {
                      if (onOpenResume) onOpenResume(r.id);
                      onNavigate('resume-studio');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 text-xs font-medium transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  );
};
