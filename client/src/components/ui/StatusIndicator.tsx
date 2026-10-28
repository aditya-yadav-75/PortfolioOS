import React from 'react';
import { clsx } from 'clsx';

interface StatusIndicatorProps {
  status: 'active' | 'warning' | 'error' | 'idle';
  label?: string;
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  pulse = true,
  className,
}) => {
  const dotColor = {
    active: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
    warning: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
    error: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]',
    idle: 'bg-slate-500',
  }[status];

  return (
    <div className={clsx('inline-flex items-center gap-2 text-xs font-medium', className)}>
      <span className="relative flex h-2 w-2">
        {pulse && status === 'active' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        )}
        <span className={clsx('relative inline-flex rounded-full h-2 w-2', dotColor)} />
      </span>
      {label && <span className="text-[#A0A5B0]">{label}</span>}
    </div>
  );
};
