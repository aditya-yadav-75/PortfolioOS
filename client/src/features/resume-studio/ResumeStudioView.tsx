import React, { useState, useEffect } from 'react';
import {
  ResumeDocument,
  CompletePortfolio,
  ResumeSectionType,
  ResumeTemplateType,
} from '@portfolio-os/shared';
import {
  Sparkles,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Sliders,
  FileCheck,
} from 'lucide-react';
import { GlassPanel } from '../../components/ui/GlassPanel';
import { ResumePaper } from './ResumePaper';
import { ResumeToolbar } from './ResumeToolbar';
import { api } from '../../lib/api';
import { useToast } from '../../components/ui/Toast';

interface ResumeStudioViewProps {
  initialResumeId?: string;
  presetRole?: 'frontend' | 'ai_ml';
}

export const ResumeStudioView: React.FC<ResumeStudioViewProps> = ({
  initialResumeId,
  presetRole,
}) => {
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<CompletePortfolio | null>(null);
  const [resume, setResume] = useState<ResumeDocument | null>(null);
  const [zoom, setZoom] = useState(0.95);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeSectionTab, setActiveSectionTab] = useState<'content' | 'reorder' | 'typography'>('content');
  const [polishingSummary, setPolishingSummary] = useState(false);

  const { success, error, info } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const port = await api.portfolio.getComplete();
      setPortfolio(port);

      const resumes = await api.resumes.getAll();
      let activeDoc: ResumeDocument | null = null;

      if (initialResumeId) {
        activeDoc = await api.resumes.getById(initialResumeId);
      } else if (presetRole) {
        activeDoc = await api.resumes.generateTailored(presetRole);
      } else if (resumes.length > 0) {
        activeDoc = await api.resumes.getById(resumes[0].id);
      } else {
        // Generate initial tailored default
        activeDoc = await api.resumes.generateTailored('frontend');
      }

      setResume(activeDoc);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      error('Failed to load resume studio', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialResumeId, presetRole]);

  // Update resume state and mark dirty
  const updateResumeState = (updater: (prev: ResumeDocument) => ResumeDocument) => {
    setResume((prev) => {
      if (!prev) return prev;
      const updated = updater(prev);
      setHasUnsavedChanges(true);
      return updated;
    });
  };

  const handleSave = async () => {
    if (!resume) return;
    try {
      setIsSaving(true);
      const updated = await api.resumes.update(resume.id, resume);
      setResume(updated);
      setHasUnsavedChanges(false);
      success('Resume saved successfully!');
    } catch (err: any) {
      error('Failed to save resume', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateTailored = async (type: 'frontend' | 'ai_ml') => {
    try {
      setLoading(true);
      const doc = await api.resumes.generateTailored(type);
      setResume(doc);
      setHasUnsavedChanges(false);
      success(`Switched to ${type === 'frontend' ? 'Frontend Developer' : 'AI / Machine Learning'} tailored resume!`);
    } catch (err: any) {
      error('Tailoring failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Section Reordering
  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!resume) return;
    const newOrder = [...resume.section_order];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    updateResumeState((prev) => ({ ...prev, section_order: newOrder }));
  };

  // Toggle Skill Selection
  const toggleSkill = (skillId: string) => {
    updateResumeState((prev) => {
      const skills = prev.selected_skills.includes(skillId)
        ? prev.selected_skills.filter((id) => id !== skillId)
        : [...prev.selected_skills, skillId];
      return { ...prev, selected_skills: skills };
    });
  };

  // Toggle Project Inclusion
  const toggleProject = (itemId: string) => {
    updateResumeState((prev) => {
      const updated = prev.selected_projects.map((p) =>
        p.item_id === itemId ? { ...p, is_included: !p.is_included } : p
      );
      return { ...prev, selected_projects: updated };
    });
  };

  // Toggle Experience Inclusion
  const toggleExperience = (itemId: string) => {
    updateResumeState((prev) => {
      const updated = prev.selected_experience.map((e) =>
        e.item_id === itemId ? { ...e, is_included: !e.is_included } : e
      );
      return { ...prev, selected_experience: updated };
    });
  };

  // AI Summary Polish
  const handlePolishSummary = async () => {
    if (!resume || !portfolio) return;
    try {
      setPolishingSummary(true);
      const res = await api.jobs.rewriteSummary({
        current_summary: resume.professional_summary,
        job_title: resume.target_role,
        target_keywords: portfolio.skills.slice(0, 5).map((s) => s.name),
        key_achievements: portfolio.achievements.map((a) => a.title),
      });
      updateResumeState((prev) => ({ ...prev, professional_summary: res.rewritten_summary }));
      success('Summary polished by AI based on verified portfolio records!');
    } catch (err: any) {
      error('Failed to polish summary', err.message);
    } finally {
      setPolishingSummary(false);
    }
  };

  if (loading || !resume || !portfolio) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RotateCcw className="w-6 h-6 animate-spin text-sky-400" />
          <span className="text-xs text-[#A0A5B0]">Loading Resume Studio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto pb-12">
      {/* Dynamic Floating Toolbar */}
      <ResumeToolbar
        resume={resume}
        onChangeName={(name) => updateResumeState((prev) => ({ ...prev, name }))}
        onChangeRole={(target_role) => updateResumeState((prev) => ({ ...prev, target_role }))}
        onChangeTemplate={(template) => updateResumeState((prev) => ({ ...prev, template }))}
        onChangeTypography={(partial) =>
          updateResumeState((prev) => ({
            ...prev,
            typography: { ...prev.typography, ...partial },
          }))
        }
        onSave={handleSave}
        onGenerateTailored={handleGenerateTailored}
        zoom={zoom}
        onChangeZoom={setZoom}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Split-Screen Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls & Selections (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Section Sub-Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl glass-panel-subtle border border-white/10 text-xs">
            <button
              onClick={() => setActiveSectionTab('content')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
                activeSectionTab === 'content'
                  ? 'bg-sky-500/20 text-white font-semibold'
                  : 'text-[#A0A5B0] hover:text-white'
              }`}
            >
              Content & Bullets
            </button>
            <button
              onClick={() => setActiveSectionTab('reorder')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
                activeSectionTab === 'reorder'
                  ? 'bg-sky-500/20 text-white font-semibold'
                  : 'text-[#A0A5B0] hover:text-white'
              }`}
            >
              Section Order
            </button>
          </div>

          {/* TAB 1: CONTENT & BULLET POINT CUSTOMIZATION */}
          {activeSectionTab === 'content' && (
            <div className="space-y-4">
              {/* Professional Summary Box */}
              <GlassPanel className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-semibold text-white">Professional Summary</span>
                  <button
                    onClick={handlePolishSummary}
                    disabled={polishingSummary}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-400/20 text-[11px] font-medium transition-all"
                  >
                    <Sparkles className="w-3 h-3" />
                    {polishingSummary ? 'Polishing...' : 'AI Polish'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={resume.professional_summary}
                  onChange={(e) =>
                    updateResumeState((prev) => ({ ...prev, professional_summary: e.target.value }))
                  }
                  className="w-full p-3 rounded-xl glass-input text-xs text-white leading-relaxed placeholder:text-[#737987]"
                  placeholder="Professional summary..."
                />
              </GlassPanel>

              {/* Skills Selection */}
              <GlassPanel className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <span className="text-xs font-semibold text-white">Selected Skills</span>
                    <p className="text-[10px] text-[#737987]">
                      {resume.selected_skills.length} of {portfolio.skills.length} selected
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateResumeState((prev) => ({
                          ...prev,
                          selected_skills: portfolio.skills.map((s) => s.id),
                        }))
                      }
                      className="text-[10px] text-sky-400 hover:underline"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() =>
                        updateResumeState((prev) => ({ ...prev, selected_skills: [] }))
                      }
                      className="text-[10px] text-[#A0A5B0] hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {portfolio.skills.map((s) => {
                    const isSelected = resume.selected_skills.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSkill(s.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-sky-500/20 text-sky-300 border-sky-400/40 shadow-sm'
                            : 'bg-white/[0.03] text-[#737987] border-white/10 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </GlassPanel>

              {/* Key Projects Selection & Bullets */}
              <GlassPanel className="space-y-3">
                <div className="border-b border-white/10 pb-2">
                  <span className="text-xs font-semibold text-white">Project Selection</span>
                  <p className="text-[10px] text-[#737987]">Choose which projects appear in this resume version</p>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {portfolio.projects.map((p) => {
                    const sel = resume.selected_projects.find((item) => item.item_id === p.id);
                    const isIncluded = sel ? sel.is_included : false;
                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isIncluded
                            ? 'bg-white/[0.04] border-white/15'
                            : 'bg-white/[0.01] border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isIncluded}
                              onChange={() => toggleProject(p.id)}
                              className="rounded bg-black/40 border-white/20 text-sky-500 w-3.5 h-3.5"
                            />
                            <span className="text-xs font-medium text-white">{p.title}</span>
                          </label>
                          <span className="text-[10px] text-[#737987] font-mono">
                            {p.technologies.slice(0, 2).join(', ')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassPanel>

              {/* Experience Selection */}
              <GlassPanel className="space-y-3">
                <div className="border-b border-white/10 pb-2">
                  <span className="text-xs font-semibold text-white">Work Experience Selection</span>
                  <p className="text-[10px] text-[#737987]">Select and customize employment bullet points</p>
                </div>
                <div className="space-y-2">
                  {portfolio.experiences.map((exp) => {
                    const sel = resume.selected_experience.find((item) => item.item_id === exp.id);
                    const isIncluded = sel ? sel.is_included : false;
                    return (
                      <div
                        key={exp.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isIncluded
                            ? 'bg-white/[0.04] border-white/15'
                            : 'bg-white/[0.01] border-white/5 opacity-60'
                        }`}
                      >
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isIncluded}
                            onChange={() => toggleExperience(exp.id)}
                            className="rounded bg-black/40 border-white/20 text-sky-500 w-3.5 h-3.5"
                          />
                          <div>
                            <div className="text-xs font-medium text-white">{exp.role}</div>
                            <div className="text-[10px] text-sky-400">{exp.company}</div>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </GlassPanel>
            </div>
          )}

          {/* TAB 2: SECTION REORDERING */}
          {activeSectionTab === 'reorder' && (
            <GlassPanel className="space-y-3">
              <div className="border-b border-white/10 pb-2">
                <span className="text-xs font-semibold text-white">Resume Section Order</span>
                <p className="text-[10px] text-[#737987]">Reorder sections to prioritize experience, projects, or education</p>
              </div>

              <div className="space-y-2">
                {resume.section_order.map((sec, index) => (
                  <div
                    key={sec}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono text-[#737987] w-4">{index + 1}.</span>
                      <span className="text-xs font-medium text-white capitalize">
                        {sec.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded text-[#A0A5B0] hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === resume.section_order.length - 1}
                        className="p-1 rounded text-[#A0A5B0] hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          )}
        </div>

        {/* RIGHT COLUMN: Live Floating Paper Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center sticky top-24">
          <div className="w-full flex items-center justify-between px-2 mb-2 text-xs text-[#737987]">
            <span className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Live Interactive Paper View (Standard Letter / A4 Print Format)
            </span>
            <span className="font-mono text-[10px]">
              Template: {resume.template === 'classic_ats' ? 'Classic ATS' : 'Modern Professional'}
            </span>
          </div>

          <div className="w-full overflow-x-auto pb-8 pt-2 flex justify-center">
            <ResumePaper resume={resume} portfolio={portfolio} scale={zoom} />
          </div>
        </div>
      </div>
    </div>
  );
};
