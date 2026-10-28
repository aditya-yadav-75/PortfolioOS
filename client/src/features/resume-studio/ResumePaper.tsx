import React from 'react';
import {
  ResumeDocument,
  CompletePortfolio,
  PortfolioProfile,
  ResumeSectionType,
} from '@portfolio-os/shared';

interface ResumePaperProps {
  resume: ResumeDocument;
  portfolio: CompletePortfolio;
  scale?: number;
}

export const ResumePaper: React.FC<ResumePaperProps> = ({
  resume,
  portfolio,
  scale = 1.0,
}) => {
  const profile = portfolio.profile || ({} as Partial<PortfolioProfile>);
  const isAts = resume.template === 'classic_ats';
  const isSerif = resume.typography.font_family === 'serif';
  const accentColor = isAts ? '#0F172A' : (resume.typography.accent_color || '#0284C7');

  const spacingClass = {
    compact: 'space-y-3 text-[11px] leading-snug',
    standard: 'space-y-4 text-[12px] leading-normal',
    spacious: 'space-y-5 text-[13px] leading-relaxed',
  }[resume.typography.spacing || 'standard'];

  const paperBg = resume.typography.paper_tone === 'warm_white' ? 'bg-[#FAFAFA]' : 'bg-[#FFFFFF]';

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: '8.5in',
        minHeight: '11in',
      }}
      className={`relative mx-auto ${paperBg} text-[#1E293B] p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-200 select-text ${
        isSerif ? 'font-serif' : 'font-sans'
      }`}
    >
      {/* HEADER SECTION */}
      {isAts ? (
        // Classic ATS Header: Centered, clean, conservative
        <header className="text-center pb-3 border-b-2 border-black space-y-1">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-black">
            {profile.full_name || 'ALEX MORGAN'}
          </h1>
          <div className="text-xs font-semibold text-[#334155] uppercase tracking-wide">
            {resume.target_role}
          </div>
          <div className="text-[11px] text-[#475569] flex flex-wrap items-center justify-center gap-x-2">
            {profile.email && <span>{profile.email}</span>}
            {profile.phone && <span>• {profile.phone}</span>}
            {profile.location && <span>• {profile.location}</span>}
            {profile.github_url && <span>• {profile.github_url.replace(/^https?:\/\//, '')}</span>}
            {profile.linkedin_url && <span>• {profile.linkedin_url.replace(/^https?:\/\//, '')}</span>}
          </div>
        </header>
      ) : (
        // Modern Professional Header: Clean Left-aligned with subtle brand bar
        <header className="pb-4 border-b border-slate-200 space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {profile.full_name || 'ALEX MORGAN'}
              </h1>
              <div
                style={{ color: accentColor }}
                className="text-xs font-bold uppercase tracking-wider mt-0.5"
              >
                {resume.target_role}
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-600 space-y-0.5">
              {profile.email && <div>{profile.email}</div>}
              {profile.phone && <div>{profile.phone}</div>}
              {profile.location && <div>{profile.location}</div>}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-3 pt-1">
            {profile.website_url && <span>{profile.website_url.replace(/^https?:\/\//, '')}</span>}
            {profile.github_url && <span>{profile.github_url.replace(/^https?:\/\//, '')}</span>}
            {profile.linkedin_url && <span>{profile.linkedin_url.replace(/^https?:\/\//, '')}</span>}
          </div>
          {/* Subtle colored accent strip */}
          <div
            style={{ backgroundColor: accentColor }}
            className="w-16 h-1 mt-2 rounded-full"
          />
        </header>
      )}

      {/* DYNAMIC SECTIONS ORDERED BY resume.section_order */}
      <div className={`mt-4 ${spacingClass}`}>
        {resume.section_order.map((sectionType) => {
          return (
            <section key={sectionType} className="space-y-1.5">
              {renderSection(sectionType, resume, portfolio, isAts, accentColor)}
            </section>
          );
        })}
      </div>
    </div>
  );
};

function renderSection(
  type: ResumeSectionType,
  resume: ResumeDocument,
  portfolio: CompletePortfolio,
  isAts: boolean,
  accentColor: string
) {
  const headingStyle = isAts
    ? 'text-xs font-bold text-black uppercase tracking-wider pb-0.5 border-b border-black'
    : 'text-xs font-bold uppercase tracking-wider pb-0.5 border-b border-slate-200';

  switch (type) {
    case 'summary': {
      if (!resume.professional_summary) return null;
      return (
        <div>
          <h2 className={headingStyle} style={!isAts ? { color: accentColor } : {}}>
            Professional Summary
          </h2>
          <p className="mt-1.5 text-justify leading-relaxed text-slate-800">
            {resume.professional_summary}
          </p>
        </div>
      );
    }

    case 'skills': {
      const selected = portfolio.skills.filter((s) => resume.selected_skills.includes(s.id));
      if (selected.length === 0) return null;

      // Group skills by category
      const categories = Array.from(new Set(selected.map((s) => s.category)));

      return (
        <div>
          <h2 className={headingStyle} style={!isAts ? { color: accentColor } : {}}>
            Technical Skills
          </h2>
          <div className="mt-1.5 space-y-1">
            {categories.map((cat) => {
              const catSkills = selected.filter((s) => s.category === cat).map((s) => s.name).join(', ');
              return (
                <div key={cat} className="text-slate-800 leading-snug">
                  <span className="font-semibold text-slate-900">{cat}: </span>
                  <span>{catSkills}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case 'experience': {
      const included = resume.selected_experience.filter((e) => e.is_included);
      if (included.length === 0) return null;

      return (
        <div>
          <h2 className={headingStyle} style={!isAts ? { color: accentColor } : {}}>
            Work Experience
          </h2>
          <div className="mt-2 space-y-3">
            {included.map((item) => {
              const exp = portfolio.experiences.find((e) => e.id === item.item_id);
              if (!exp) return null;
              const bullets = item.custom_bullets || exp.bullet_points;
              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-bold text-slate-900">
                        {item.custom_title || exp.role}
                      </span>
                      <span className="text-slate-600"> — {exp.company}</span>
                      {exp.location && <span className="text-slate-500 text-[10px]"> ({exp.location})</span>}
                    </div>
                    <div className="text-[11px] text-slate-600 shrink-0 font-medium">
                      {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date || ''}
                    </div>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-800">
                    {bullets.map((b, idx) => (
                      <li key={idx} className="leading-snug pl-1">{b}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case 'projects': {
      const included = resume.selected_projects.filter((p) => p.is_included);
      if (included.length === 0) return null;

      return (
        <div>
          <h2 className={headingStyle} style={!isAts ? { color: accentColor } : {}}>
            Key Projects
          </h2>
          <div className="mt-2 space-y-3">
            {included.map((item) => {
              const proj = portfolio.projects.find((p) => p.id === item.item_id);
              if (!proj) return null;
              const bullets = item.custom_bullets || proj.bullet_points;
              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-bold text-slate-900">
                        {item.custom_title || proj.title}
                      </span>
                      {proj.technologies.length > 0 && (
                        <span className="text-slate-600 text-[11px]">
                          {' '}| {proj.technologies.join(', ')}
                        </span>
                      )}
                    </div>
                    {proj.start_date && (
                      <div className="text-[11px] text-slate-600 shrink-0">
                        {proj.start_date} {proj.end_date ? `– ${proj.end_date}` : ''}
                      </div>
                    )}
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-800">
                    {bullets.map((b, idx) => (
                      <li key={idx} className="leading-snug pl-1">{b}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case 'education': {
      const included = resume.selected_education.filter((e) => e.is_included);
      if (included.length === 0) return null;

      return (
        <div>
          <h2 className={headingStyle} style={!isAts ? { color: accentColor } : {}}>
            Education
          </h2>
          <div className="mt-2 space-y-2">
            {included.map((item) => {
              const edu = portfolio.education.find((e) => e.id === item.item_id);
              if (!edu) return null;
              return (
                <div key={item.id}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-slate-900">{edu.institution}</span>
                    <span className="text-[11px] text-slate-600">
                      {edu.start_date} – {edu.is_current ? 'Present' : edu.end_date || ''}
                    </span>
                  </div>
                  <div className="text-slate-800 text-[11px]">
                    {edu.degree} in {edu.field_of_study}
                    {edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
                    {edu.honors ? ` (${edu.honors})` : ''}
                  </div>
                  {edu.description && (
                    <div className="text-slate-600 text-[10.5px] mt-0.5 leading-snug">
                      {edu.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case 'certifications': {
      const included = resume.selected_certifications.filter((c) => c.is_included);
      if (included.length === 0) return null;

      return (
        <div>
          <h2 className={headingStyle} style={!isAts ? { color: accentColor } : {}}>
            Certifications & Training
          </h2>
          <div className="mt-1.5 space-y-1">
            {included.map((item) => {
              const cert = portfolio.certifications.find((c) => c.id === item.item_id);
              if (!cert) return null;
              return (
                <div key={item.id} className="text-slate-800 leading-snug flex items-baseline justify-between">
                  <div>
                    <span className="font-semibold text-slate-900">{cert.title}</span>
                    <span className="text-slate-600"> — {cert.issuer}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0">{cert.issue_date}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case 'achievements': {
      const included = resume.selected_achievements.filter((a) => a.is_included);
      if (included.length === 0) return null;

      return (
        <div>
          <h2 className={headingStyle} style={!isAts ? { color: accentColor } : {}}>
            Achievements & Honors
          </h2>
          <div className="mt-1.5 space-y-1">
            {included.map((item) => {
              const ach = portfolio.achievements.find((a) => a.id === item.item_id);
              if (!ach) return null;
              return (
                <div key={item.id} className="text-slate-800 leading-snug">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-slate-900">{ach.title}</span>
                    <span className="text-[11px] text-slate-500 shrink-0">{ach.date}</span>
                  </div>
                  {ach.description && (
                    <div className="text-slate-600 text-[11px]">{ach.description}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
