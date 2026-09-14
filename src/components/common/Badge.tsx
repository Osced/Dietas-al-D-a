import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'cyan' | 'rose' | 'amber' | 'slate' | 'purple';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'sm',
  icon,
  className = '',
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200 font-medium',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 font-medium',
    amber: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 font-medium',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md border whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
