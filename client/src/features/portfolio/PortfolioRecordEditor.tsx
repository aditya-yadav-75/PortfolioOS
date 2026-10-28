import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Plus, Trash2 } from 'lucide-react';

interface RecordEditorProps {
  type: 'profile' | 'education' | 'skill' | 'project' | 'experience' | 'certification' | 'achievement' | 'publication' | 'language';
  initialData?: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export const PortfolioRecordEditor: React.FC<RecordEditorProps> = ({
  type,
  initialData,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [saving, setSaving] = useState(false);
  const [bulletInput, setBulletInput] = useState('');
  const [techInput, setTechInput] = useState('');

  // Update field
  const handleChange = (field: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  // Add bullet point
  const handleAddBullet = () => {
    if (!bulletInput.trim()) return;
    const bullets = Array.isArray(formData.bullet_points) ? [...formData.bullet_points] : [];
    bullets.push(bulletInput.trim());
    handleChange('bullet_points', bullets);
    setBulletInput('');
  };

  const handleRemoveBullet = (index: number) => {
    const bullets = [...(formData.bullet_points || [])];
    bullets.splice(index, 1);
    handleChange('bullet_points', bullets);
  };

  // Add technology
  const handleAddTech = () => {
    if (!techInput.trim()) return;
    const techs = Array.isArray(formData.technologies) ? [...formData.technologies] : [];
    if (!techs.includes(techInput.trim())) {
      techs.push(techInput.trim());
      handleChange('technologies', techs);
    }
    setTechInput('');
  };

  const handleRemoveTech = (t: string) => {
    const techs = (formData.technologies || []).filter((item: string) => item !== t);
    handleChange('technologies', techs);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${initialData?.id ? 'Edit' : 'Add'} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* PROFILE */}
        {type === 'profile' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Full Name" required>
                <input
                  type="text"
                  required
                  value={formData.full_name || ''}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="e.g. Alex Morgan"
                />
              </FormField>
              <FormField label="Professional Headline" required>
                <input
                  type="text"
                  required
                  value={formData.headline || ''}
                  onChange={(e) => handleChange('headline', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="e.g. Full-Stack Engineer & AI Researcher"
                />
              </FormField>
              <FormField label="Email Address" required>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="alex@example.com"
                />
              </FormField>
              <FormField label="Phone Number">
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="+1 (555) 019-2834"
                />
              </FormField>
              <FormField label="Location">
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="San Francisco, CA"
                />
              </FormField>
              <FormField label="Website URL">
                <input
                  type="url"
                  value={formData.website_url || ''}
                  onChange={(e) => handleChange('website_url', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="https://alexmorgan.dev"
                />
              </FormField>
              <FormField label="GitHub URL">
                <input
                  type="url"
                  value={formData.github_url || ''}
                  onChange={(e) => handleChange('github_url', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="https://github.com/alexmorgan"
                />
              </FormField>
              <FormField label="LinkedIn URL">
                <input
                  type="url"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="https://linkedin.com/in/alexmorgan"
                />
              </FormField>
            </div>
            <FormField label="Professional Summary" required>
              <textarea
                rows={4}
                required
                value={formData.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="2-4 sentences describing technical foundation, strengths, and career highlights..."
              />
            </FormField>
            <FormField label="Career Objective">
              <textarea
                rows={2}
                value={formData.career_objective || ''}
                onChange={(e) => handleChange('career_objective', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="Target roles, industry focus, and impact goals..."
              />
            </FormField>
          </>
        )}

        {/* SKILL */}
        {type === 'skill' && (
          <div className="space-y-4">
            <FormField label="Skill Name" required>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="e.g. React, TypeScript, PyTorch"
              />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Category" required>
                <select
                  value={formData.category || 'Languages'}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-[#101216]"
                >
                  <option value="Languages">Languages</option>
                  <option value="Frameworks & Libraries">Frameworks & Libraries</option>
                  <option value="Databases & Cloud">Databases & Cloud</option>
                  <option value="Tools & DevOps">Tools & DevOps</option>
                  <option value="Core Concepts">Core Concepts</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </FormField>
              <FormField label="Proficiency Level" required>
                <select
                  value={formData.proficiency || 'Intermediate'}
                  onChange={(e) => handleChange('proficiency', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-[#101216]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </FormField>
            </div>
            <FormField label="Years of Experience">
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.years_experience ?? ''}
                onChange={(e) => handleChange('years_experience', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="e.g. 2.5"
              />
            </FormField>
          </div>
        )}

        {/* PROJECT */}
        {type === 'project' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Project Title" required>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="e.g. PulseUI Component Library"
                />
              </FormField>
              <FormField label="Subtitle / Tagline">
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="Apple-inspired spatial design system"
                />
              </FormField>
            </div>

            <FormField label="Project Overview / Description" required>
              <textarea
                rows={3}
                required
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="Core architectural achievements and problem solved..."
              />
            </FormField>

            {/* Bullet Points */}
            <div>
              <label className="block text-xs font-medium text-[#A0A5B0] uppercase tracking-wide mb-1.5">
                Bullet Points (Action & Impact)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={bulletInput}
                  onChange={(e) => setBulletInput(e.target.value)}
                  placeholder="e.g. Engineered 35+ components with sub-millisecond render benchmarks"
                  className="flex-1 px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddBullet}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <ul className="space-y-1.5 max-h-36 overflow-y-auto">
                {(formData.bullet_points || []).map((b: string, idx: number) => (
                  <li key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] text-xs text-white">
                    <span className="truncate pr-2">• {b}</span>
                    <button type="button" onClick={() => handleRemoveBullet(idx)} className="text-rose-400 hover:text-rose-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-xs font-medium text-[#A0A5B0] uppercase tracking-wide mb-1.5">
                Technologies Used
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="e.g. React, Tailwind CSS, Vite"
                  className="flex-1 px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Tech
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(formData.technologies || []).map((t: string) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs">
                    {t}
                    <button type="button" onClick={() => handleRemoveTech(t)} className="hover:text-rose-400">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="GitHub Repository URL">
                <input
                  type="url"
                  value={formData.github_url || ''}
                  onChange={(e) => handleChange('github_url', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="https://github.com/..."
                />
              </FormField>
              <FormField label="Live Demo URL">
                <input
                  type="url"
                  value={formData.live_url || ''}
                  onChange={(e) => handleChange('live_url', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="https://..."
                />
              </FormField>
            </div>
          </div>
        )}

        {/* EXPERIENCE */}
        {type === 'experience' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Company Name" required>
                <input
                  type="text"
                  required
                  value={formData.company || ''}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="e.g. Vanguard Tech Labs"
                />
              </FormField>
              <FormField label="Role / Title" required>
                <input
                  type="text"
                  required
                  value={formData.role || ''}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="e.g. Full-Stack Engineering Intern"
                />
              </FormField>
              <FormField label="Employment Type" required>
                <select
                  value={formData.employment_type || 'Internship'}
                  onChange={(e) => handleChange('employment_type', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-[#101216]"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </FormField>
              <FormField label="Location">
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="San Francisco, CA"
                />
              </FormField>
              <FormField label="Start Date" required>
                <input
                  type="date"
                  required
                  value={formData.start_date || ''}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </FormField>
              <FormField label="End Date">
                <input
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => handleChange('end_date', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </FormField>
            </div>
            <FormField label="Overview / Description" required>
              <textarea
                rows={3}
                required
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="High-level description of responsibilities and team context..."
              />
            </FormField>
          </div>
        )}

        {/* EDUCATION */}
        {type === 'education' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Institution" required>
                <input
                  type="text"
                  required
                  value={formData.institution || ''}
                  onChange={(e) => handleChange('institution', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="California Institute of Technology"
                />
              </FormField>
              <FormField label="Degree" required>
                <input
                  type="text"
                  required
                  value={formData.degree || ''}
                  onChange={(e) => handleChange('degree', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="Bachelor of Science"
                />
              </FormField>
              <FormField label="Field of Study" required>
                <input
                  type="text"
                  required
                  value={formData.field_of_study || ''}
                  onChange={(e) => handleChange('field_of_study', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="Computer Science & Artificial Intelligence"
                />
              </FormField>
              <FormField label="GPA">
                <input
                  type="text"
                  value={formData.gpa || ''}
                  onChange={(e) => handleChange('gpa', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="3.92 / 4.0"
                />
              </FormField>
              <FormField label="Start Date" required>
                <input
                  type="date"
                  required
                  value={formData.start_date || ''}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </FormField>
              <FormField label="End Date">
                <input
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => handleChange('end_date', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </FormField>
            </div>
            <FormField label="Academic Honors / Relevant Coursework">
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="Dean's List, Distributed Systems, Deep Learning, Algorithms..."
              />
            </FormField>
          </div>
        )}

        {/* CERTIFICATION */}
        {type === 'certification' && (
          <div className="space-y-4">
            <FormField label="Certification Title" required>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="Meta Front-End Developer Certificate"
              />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Issuer" required>
                <input
                  type="text"
                  required
                  value={formData.issuer || ''}
                  onChange={(e) => handleChange('issuer', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="Meta / Coursera"
                />
              </FormField>
              <FormField label="Issue Date" required>
                <input
                  type="date"
                  required
                  value={formData.issue_date || ''}
                  onChange={(e) => handleChange('issue_date', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </FormField>
            </div>
            <FormField label="Credential URL">
              <input
                type="url"
                value={formData.credential_url || ''}
                onChange={(e) => handleChange('credential_url', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="https://coursera.org/verify/..."
              />
            </FormField>
          </div>
        )}

        {/* ACHIEVEMENT */}
        {type === 'achievement' && (
          <div className="space-y-4">
            <FormField label="Achievement Title" required>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="1st Place Winner — University AI Hackathon"
              />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Issuer / Organization" required>
                <input
                  type="text"
                  required
                  value={formData.issuer || ''}
                  onChange={(e) => handleChange('issuer', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="CalTech Computer Club"
                />
              </FormField>
              <FormField label="Date" required>
                <input
                  type="date"
                  required
                  value={formData.date || ''}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </FormField>
            </div>
            <FormField label="Description">
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                placeholder="Awarded Grand Prize out of 65 teams..."
              />
            </FormField>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#A0A5B0] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-sky-500/25 hover:bg-sky-500/35 text-sky-400 border border-sky-400/40 text-xs font-semibold shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
