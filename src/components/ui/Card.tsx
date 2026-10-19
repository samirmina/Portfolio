'use client';

import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}

export function Card({
  children,
  className,
  padded = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-700 bg-slate-900/50 backdrop-blur-sm',
        padded && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
