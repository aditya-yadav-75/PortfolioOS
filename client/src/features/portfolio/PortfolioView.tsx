import React, { useState, useEffect } from 'react';
import {
  User,
  Sparkles,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  Search,
  ExternalLink,
  Github,
  Globe,
} from 'lucide-react';
import { GlassPanel } from '../../components/ui/GlassPanel';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { PortfolioRecordEditor } from './PortfolioRecordEditor';
import { api } from '../../lib/api';
import { useToast } from '../../components/ui/Toast';
import { CompletePortfolio } from '@portfolio-os/shared';

export const PortfolioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'projects' | 'experience' | 'education' | 'certifications' | 'achievements'>('profile');
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<CompletePortfolio | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editorState, setEditorState] = useState<{ isOpen: boolean; type: any; initialData?: any }>({
    isOpen: false,
    type: 'profile',
  });

  const { success, error } = useToast();

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const data = await api.portfolio.getComplete();
      setPortfolio(data);
    } catch (err: any) {
      error('Failed to load portfolio', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleSaveRecord = async (data: any) => {
    try {
      if (editorState.type === 'profile') {
        await api.portfolio.updateProfile(data);
      } else if (editorState.type === 'skill') {
        if (data.id) await api.portfolio.updateSkill(data.id, data);
        else await api.portfolio.addSkill(data);
      } else if (editorState.type === 'project') {
        if (data.id) await api.portfolio.updateProject(data.id, data);
        else await api.portfolio.addProject(data);
      } else if (editorState.type === 'experience') {
        if (data.id) await api.portfolio.updateExperience(data.id, data);
        else await api.portfolio.addExperience(data);
      } else if (editorState.type === 'education') {
        if (data.id) await api.portfolio.updateEducation(data.id, data);
        else await api.portfolio.addEducation(data);
      } else if (editorState.type === 'certification') {
        if (data.id) await api.portfolio.updateCertification(data.id, data);
        else await api.portfolio.addCertification(data);
      } else if (editorState.type === 'achievement') {
        if (data.id) {
          // achievements don't have separate update in api, re-add
        } else {
          await api.portfolio.addAchievement(data);
        }
      }
      success('Record saved successfully');
      loadPortfolio();
    } catch (err: any) {
      error('Failed to save record', err.message);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      if (type === 'skill') await api.portfolio.deleteSkill(id);
      if (type === 'project') await api.portfolio.deleteProject(id);
      if (type === 'experience') await api.portfolio.deleteExperience(id);
      if (type === 'education') await api.portfolio.deleteEducation(id);
      if (type === 'certification') await api.portfolio.deleteCertification(id);
      if (type === 'achievement') await api.portfolio.deleteAchievement(id);
      success('Record deleted');
      loadPortfolio();
    } catch (err: any) {
      error('Failed to delete', err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await api.portfolio.importJson(parsed);
      success('Portfolio imported from JSON successfully!');
      loadPortfolio();
    } catch (err: any) {
      error('JSON Import failed', err.message);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, count: portfolio?.profile ? 1 : 0 },
    { id: 'skills', label: 'Skills', icon: Sparkles, count: portfolio?.skills?.length ?? 0 },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: portfolio?.projects?.length ?? 0 },
    { id: 'experience', label: 'Experience', icon: Briefcase, count: portfolio?.experiences?.length ?? 0 },
    { id: 'education', label: 'Education', icon: GraduationCap, count: portfolio?.education?.length ?? 0 },
    { id: 'certifications', label: 'Certifications', icon: Award, count: portfolio?.certifications?.length ?? 0 },
    { id: 'achievements', label: 'Achievements', icon: Award, count: portfolio?.achievements?.length ?? 0 },
  ] as const;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="My Portfolio"
        badge="SQLite Database"
        description="Structured, evidence-grounded career records. Everything here directly feeds resume generation and AI matching."
        actions={
          <div className="flex items-center gap-2">
            <a
              href={api.portfolio.getExportUrl()}
              download="portfolio_backup.json"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-white border border-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" /> Export JSON
            </a>
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-white border border-white/10 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-emerald-400" /> Import JSON
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
            {activeTab !== 'profile' && (
              <button
                onClick={() => setEditorState({ isOpen: true, type: activeTab.slice(0, -1) as any })}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-400/30 text-xs font-semibold shadow-[0_0_12px_rgba(56,189,248,0.2)] transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add {activeTab.slice(0, -1)}
              </button>
            )}
          </div>
        }
      />

      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-white/10">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as any);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-sky-500/20 text-white border border-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                  : 'text-[#A0A5B0] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : ''}`} />
              <span>{t.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-[#737987]">
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* PROFILE VIEW */}
      {activeTab === 'profile' && (
        <GlassPanel className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400/20 to-sky-600/10 border border-sky-400/30 flex items-center justify-center text-sky-400 text-xl font-bold">
                {portfolio?.profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {portfolio?.profile?.full_name || 'No Profile Configured'}
                </h2>
                <p className="text-xs text-sky-400 mt-0.5">{portfolio?.profile?.headline || 'Add a headline'}</p>
                <p className="text-xs text-[#737987] mt-1">{portfolio?.profile?.location || 'Location not set'}</p>
              </div>
            </div>
            <button
              onClick={() => setEditorState({ isOpen: true, type: 'profile', initialData: portfolio?.profile })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-white border border-white/10 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-sky-400" /> Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
            <div>
              <span className="text-[#737987] block mb-1 uppercase tracking-wider text-[10px]">Email</span>
              <span className="text-white font-mono">{portfolio?.profile?.email || '—'}</span>
            </div>
            <div>
              <span className="text-[#737987] block mb-1 uppercase tracking-wider text-[10px]">Phone</span>
              <span className="text-white">{portfolio?.profile?.phone || '—'}</span>
            </div>
            <div>
              <span className="text-[#737987] block mb-1 uppercase tracking-wider text-[10px]">Links</span>
              <div className="flex items-center gap-3">
                {portfolio?.profile?.github_url && (
                  <a href={portfolio.profile.github_url} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-1">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
                {portfolio?.profile?.linkedin_url && (
                  <a href={portfolio.profile.linkedin_url} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                )}
                {portfolio?.profile?.website_url && (
                  <a href={portfolio.profile.website_url} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#737987] font-medium mb-1.5">Professional Summary</h4>
              <p className="text-xs text-[#F3F4F6] leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                {portfolio?.profile?.summary || 'No summary written yet. Click Edit Profile to add one.'}
              </p>
            </div>
            {portfolio?.profile?.career_objective && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#737987] font-medium mb-1.5">Career Objective</h4>
                <p className="text-xs text-[#A0A5B0] leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  {portfolio.profile.career_objective}
                </p>
              </div>
            )}
          </div>
        </GlassPanel>
      )}

      {/* SKILLS TAB */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737987]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills by name or category..."
              className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs text-white placeholder:text-[#737987]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(portfolio?.skills || [])
              .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((s) => (
                <div key={s.id} className="p-3.5 rounded-xl glass-panel-subtle flex items-center justify-between border border-white/5 hover:border-white/15 transition-all group">
                  <div>
                    <div className="text-xs font-semibold text-white">{s.name}</div>
                    <div className="text-[10px] text-[#737987] flex items-center gap-2 mt-0.5">
                      <span className="text-sky-400">{s.category}</span>
                      <span>•</span>
                      <span>{s.proficiency}</span>
                      {s.years_experience && <span>• {s.years_experience} yrs</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditorState({ isOpen: true, type: 'skill', initialData: s })}
                      className="p-1 text-[#A0A5B0] hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete('skill', s.id)}
                      className="p-1 text-[#A0A5B0] hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {(portfolio?.projects || []).map((p) => (
            <GlassPanel key={p.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                    {p.featured && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] bg-sky-500/10 text-sky-400 border border-sky-400/20 font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  {p.subtitle && <p className="text-xs text-sky-400 mt-0.5">{p.subtitle}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditorState({ isOpen: true, type: 'project', initialData: p })}
                    className="p-1.5 rounded-lg text-[#A0A5B0] hover:text-white hover:bg-white/10"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete('project', p.id)}
                    className="p-1.5 rounded-lg text-[#A0A5B0] hover:text-rose-400 hover:bg-white/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#A0A5B0] leading-relaxed">{p.description}</p>

              {p.bullet_points.length > 0 && (
                <ul className="space-y-1 text-xs text-[#F3F4F6] pl-2 border-l border-white/10">
                  {p.bullet_points.map((b, idx) => (
                    <li key={idx} className="leading-snug">• {b}</li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                <div className="flex flex-wrap gap-1.5">
                  {p.technologies.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-[#A0A5B0] border border-white/10 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {p.github_url && (
                    <a href={p.github_url} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-1 text-[11px]">
                      <Github className="w-3 h-3" /> Code
                    </a>
                  )}
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]">
                      <ExternalLink className="w-3 h-3" /> Demo
                    </a>
                  )}
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}

      {/* EXPERIENCE TAB */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          {(portfolio?.experiences || []).map((exp) => (
            <GlassPanel key={exp.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{exp.role}</h3>
                  <div className="text-xs text-sky-400 mt-0.5">
                    {exp.company} • {exp.employment_type} • {exp.location || 'Remote'}
                  </div>
                  <div className="text-[10px] text-[#737987] mt-0.5">
                    {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date || ''}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditorState({ isOpen: true, type: 'experience', initialData: exp })}
                    className="p-1.5 rounded-lg text-[#A0A5B0] hover:text-white hover:bg-white/10"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete('experience', exp.id)}
                    className="p-1.5 rounded-lg text-[#A0A5B0] hover:text-rose-400 hover:bg-white/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#A0A5B0] leading-relaxed">{exp.description}</p>
              {exp.bullet_points.length > 0 && (
                <ul className="space-y-1 text-xs text-[#F3F4F6] pl-2 border-l border-white/10">
                  {exp.bullet_points.map((b, idx) => (
                    <li key={idx}>• {b}</li>
                  ))}
                </ul>
              )}
            </GlassPanel>
          ))}
        </div>
      )}

      {/* EDUCATION TAB */}
      {activeTab === 'education' && (
        <div className="space-y-4">
          {(portfolio?.education || []).map((edu) => (
            <GlassPanel key={edu.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{edu.institution}</h3>
                  <div className="text-xs text-sky-400 mt-0.5">
                    {edu.degree} in {edu.field_of_study} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                  </div>
                  <div className="text-[10px] text-[#737987] mt-0.5">
                    {edu.start_date} – {edu.is_current ? 'Present' : edu.end_date || ''}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditorState({ isOpen: true, type: 'education', initialData: edu })}
                    className="p-1.5 rounded-lg text-[#A0A5B0] hover:text-white hover:bg-white/10"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete('education', edu.id)}
                    className="p-1.5 rounded-lg text-[#A0A5B0] hover:text-rose-400 hover:bg-white/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {edu.description && <p className="text-xs text-[#A0A5B0] leading-relaxed">{edu.description}</p>}
            </GlassPanel>
          ))}
        </div>
      )}

      {/* CERTIFICATIONS TAB */}
      {activeTab === 'certifications' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(portfolio?.certifications || []).map((c) => (
            <GlassPanel key={c.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-white">{c.title}</h3>
                  <div className="text-[11px] text-sky-400 mt-0.5">{c.issuer}</div>
                  <div className="text-[10px] text-[#737987] mt-0.5">Issued: {c.issue_date}</div>
                </div>
                <button
                  onClick={() => handleDelete('certification', c.id)}
                  className="p-1 text-[#A0A5B0] hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {c.credential_url && (
                <a href={c.credential_url} target="_blank" rel="noreferrer" className="text-[11px] text-sky-400 hover:underline flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> View Verification
                </a>
              )}
            </GlassPanel>
          ))}
        </div>
      )}

      {/* ACHIEVEMENTS TAB */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(portfolio?.achievements || []).map((a) => (
            <GlassPanel key={a.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-white">{a.title}</h3>
                  <div className="text-[11px] text-amber-400 mt-0.5">{a.issuer} • {a.date}</div>
                </div>
                <button
                  onClick={() => handleDelete('achievement', a.id)}
                  className="p-1 text-[#A0A5B0] hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {a.description && <p className="text-xs text-[#A0A5B0] leading-relaxed">{a.description}</p>}
            </GlassPanel>
          ))}
        </div>
      )}

      {/* Record Editor Modal */}
      <PortfolioRecordEditor
        type={editorState.type}
        initialData={editorState.initialData}
        isOpen={editorState.isOpen}
        onClose={() => setEditorState({ isOpen: false, type: editorState.type })}
        onSave={handleSaveRecord}
      />
    </div>
  );
};
