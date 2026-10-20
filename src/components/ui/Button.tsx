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
    'relative inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary:
      'bg-[#238636] text-white hover:bg-[#2ea043] focus-visible:ring-offset-[#0d1117] active:scale-95',
    outline:
      'border border-[#30363d] bg-transparent text-[#c9d1d9] hover:bg-[#161b22] focus-visible:ring-offset-[#0d1117]',
    ghost:
      'bg-transparent text-[#8b949e] hover:bg-[#161b22] hover:text-white focus-visible:ring-offset-[#0d1117]',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-8 text-base',
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
