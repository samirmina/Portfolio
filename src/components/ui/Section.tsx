import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface SectionProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = 'View all →',
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn('py-12 sm:py-16', className)}>
      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-white tracking-tight mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base text-[#8b949e] leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      <div className="space-y-8">{children}</div>
      {viewAllHref && (
        <div className="mt-8">
          <Link
            href={viewAllHref}
            className="text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium transition-colors"
          >
            {viewAllLabel}
          </Link>
        </div>
      )}
    </section>
  );
}
