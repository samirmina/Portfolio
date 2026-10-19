'use client';

import { cn } from '@/lib/utils';

export interface FocusRingProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Visible focus ring per WCAG 2.1 AA:
 * ring-2 ring-teal-400 ring-offset-2 ring-offset-slate-950
 * Only visible on keyboard focus (:focus-visible), not on mouse click.
 */
export function FocusRing({
  children,
  className,
  ...props
}: FocusRingProps) {
  return (
    <span
      className={cn(
        'inline-block focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-950 rounded-md',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
