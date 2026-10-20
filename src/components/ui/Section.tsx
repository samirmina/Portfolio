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
    <section className={cn('py-16 sm:py-20', className)}>
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-[#8b949e] leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>
      <div className="space-y-8">{children}</div>
      {viewAllHref && (
        <div className="mt-10">
          <Link
            href={viewAllHref}
            className="inline-flex items-center text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium transition-colors"
          >
            {viewAllLabel}
          </Link>
        </div>
      )}
    </section>
  );
}
