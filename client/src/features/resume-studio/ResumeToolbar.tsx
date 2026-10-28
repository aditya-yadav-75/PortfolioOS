import React from 'react';
import {
  Download,
  Save,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Palette,
  Check,
} from 'lucide-react';
import { ResumeDocument, ResumeTemplateType } from '@portfolio-os/shared';
import { api } from '../../lib/api';

interface ResumeToolbarProps {
  resume: ResumeDocument;
  onChangeName: (name: string) => void;
  onChangeRole: (role: string) => void;
  onChangeTemplate: (template: ResumeTemplateType) => void;
  onChangeTypography: (partial: any) => void;
  onSave: () => void;
  onGenerateTailored: (type: 'frontend' | 'ai_ml') => void;
  zoom: number;
  onChangeZoom: (zoom: number) => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

export const ResumeToolbar: React.FC<ResumeToolbarProps> = ({
  resume,
  onChangeName,
  onChangeRole,
  onChangeTemplate,
  onChangeTypography,
  onSave,
  onGenerateTailored,
  zoom,
  onChangeZoom,
  isSaving,
  hasUnsavedChanges,
}) => {
  const accentColors = ['#0284C7', '#0F172A', '#0D9488', '#4F46E5', '#BE185D'];

  return (
    <div className="glass-toolbar rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4 sticky top-4 z-30">
      {/* Document Title & Role Inputs */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <input
            type="text"
            value={resume.name}
            onChange={(e) => onChangeName(e.target.value)}
            className="bg-transparent border-b border-white/20 hover:border-white/40 focus:border-sky-400 font-semibold text-sm text-white px-1 py-0.5 outline-none transition-colors"
            placeholder="Resume Document Title"
          />
        </div>
        <span className="text-white/20">/</span>
        <div>
          <input
            type="text"
            value={resume.target_role}
            onChange={(e) => onChangeRole(e.target.value)}
            className="bg-transparent border-b border-white/10 hover:border-white/30 focus:border-sky-400 text-xs text-sky-400 px-1 py-0.5 outline-none transition-colors"
            placeholder="Target Role"
          />
        </div>
      </div>

      {/* Template & Styling Controls */}
      <div className="flex items-center gap-2">
        {/* Template Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-medium">
          <button
            onClick={() => onChangeTemplate('modern_professional')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              resume.template === 'modern_professional'
                ? 'bg-sky-500/20 text-white shadow-sm border border-sky-400/30 font-semibold'
                : 'text-[#A0A5B0] hover:text-white'
            }`}
          >
            Modern
          </button>
          <button
            onClick={() => onChangeTemplate('classic_ats')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              resume.template === 'classic_ats'
                ? 'bg-sky-500/20 text-white shadow-sm border border-sky-400/30 font-semibold'
                : 'text-[#A0A5B0] hover:text-white'
            }`}
          >
            Classic ATS
          </button>
        </div>

        {/* Font Family (Sans vs Serif) */}
        <select
          value={resume.typography.font_family}
          onChange={(e) => onChangeTypography({ font_family: e.target.value })}
          className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white outline-none cursor-pointer"
        >
          <option value="sans" className="bg-[#101216]">Sans-Serif</option>
          <option value="serif" className="bg-[#101216]">Serif (Classic)</option>
        </select>

        {/* Spacing */}
        <select
          value={resume.typography.spacing}
          onChange={(e) => onChangeTypography({ spacing: e.target.value })}
          className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white outline-none cursor-pointer"
        >
          <option value="compact" className="bg-[#101216]">Compact</option>
          <option value="standard" className="bg-[#101216]">Standard</option>
          <option value="spacious" className="bg-[#101216]">Spacious</option>
        </select>

        {/* Accent Color Picker (for Modern template) */}
        {resume.template === 'modern_professional' && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/[0.05] border border-white/10">
            {accentColors.map((color) => (
              <button
                key={color}
                style={{ backgroundColor: color }}
                onClick={() => onChangeTypography({ accent_color: color })}
                className={`w-3.5 h-3.5 rounded-full transition-transform ${
                  resume.typography.accent_color === color ? 'scale-125 ring-2 ring-white/60' : 'opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        )}

        {/* Zoom */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-[#A0A5B0]">
          <button onClick={() => onChangeZoom(Math.max(0.6, zoom - 0.1))} className="hover:text-white">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono px-1">{Math.round(zoom * 100)}%</span>
          <button onClick={() => onChangeZoom(Math.min(1.3, zoom + 0.1))} className="hover:text-white">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons: Save & Real Download PDF */}
      <div className="flex items-center gap-2">
        {/* Preset Tailor Buttons */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-white border border-white/10 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Tailor Preset
          </button>
          <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block w-48 rounded-xl glass-panel-elevated p-1.5 shadow-xl border border-white/15 z-50">
            <button
              onClick={() => onGenerateTailored('frontend')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-white hover:bg-white/10 transition-colors"
            >
              Frontend Developer Intern
            </button>
            <button
              onClick={() => onGenerateTailored('ai_ml')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-white hover:bg-white/10 transition-colors"
            >
              AI / Machine Learning Intern
            </button>
          </div>
        </div>

        <button
          onClick={onSave}
          disabled={isSaving}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            hasUnsavedChanges
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
              : 'bg-white/[0.08] text-white border-white/15 hover:bg-white/[0.12]'
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}
        </button>

        <a
          href={api.resumes.getPdfDownloadUrl(resume.id)}
          download
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-sky-500/25 hover:bg-sky-500/35 text-sky-400 border border-sky-400/40 text-xs font-semibold shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Download PDF
        </a>
      </div>
    </div>
  );
};
