import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'elevated' | 'card';
  glowing?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  variant = 'default',
  glowing = false,
  children,
  className,
  ...props
}) => {
  const variantStyles = {
    default: 'glass-panel rounded-2xl p-6',
    subtle: 'glass-panel-subtle rounded-xl p-4',
    elevated: 'glass-panel-elevated rounded-2xl p-6',
    card: 'glass-panel rounded-xl p-5 hover:border-white/20 transition-all duration-200',
  }[variant];

  return (
    <div
      className={twMerge(
        variantStyles,
        'relative overflow-hidden edge-highlight',
        glowing && 'ring-1 ring-sky-500/30 shadow-[0_0_24px_rgba(56,189,248,0.12)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
