import React from 'react';

interface PageHeaderProps {
  title: string;
  badge?: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  badge,
  description,
  actions,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-[#F3F4F6]">
            {title}
          </h1>
          {badge && (
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1.5 text-sm text-[#A0A5B0] max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};
