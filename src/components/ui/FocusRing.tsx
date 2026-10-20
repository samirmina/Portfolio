'use client';

import { cn } from '@/lib/utils';

export interface FocusRingProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Visible focus ring per WCAG 2.1 AA:
 * ring-2 ring-[#58a6ff] ring-offset-2 ring-offset-[#0d1117]
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
        'inline-block focus-within:outline-none focus-within:ring-2 focus-within:ring-[#58a6ff] focus-within:ring-offset-2 focus-within:ring-offset-[#0d1117] rounded-md',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
