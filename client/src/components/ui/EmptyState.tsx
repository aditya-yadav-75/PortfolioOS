import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
      <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-[#A0A5B0] mb-4">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-medium text-[#F3F4F6]">{title}</h3>
      <p className="text-xs text-[#737987] max-w-sm mt-1.5 leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-4 py-2 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
