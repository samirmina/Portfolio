'use client';

import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const base =
    'relative inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary:
      'bg-teal-600 text-slate-950 hover:bg-teal-500 focus-visible:ring-offset-slate-950 active:scale-95',
    outline:
      'border border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800 focus-visible:ring-offset-slate-950',
    ghost:
      'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:ring-offset-slate-950',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (asChild) {
    const child = children as React.ReactElement;
    if (child && typeof child === 'object' && 'props' in child) {
      return (
        <child.type
          {...props}
          {...child.props}
          className={cn(classes, child.props.className)}
        />
      );
    }
  }

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
