import React from 'react';
import { clsx } from 'clsx';

interface FormFieldProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required,
  children,
  className,
}) => {
  return (
    <div className={clsx('space-y-1.5', className)}>
      <label className="block text-xs font-medium text-[#A0A5B0] tracking-wide uppercase">
        {label}
        {required && <span className="text-sky-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#737987] mt-1">{helperText}</p>}
    </div>
  );
};
