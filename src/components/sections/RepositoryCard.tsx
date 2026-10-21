import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
/** Format a date deterministically (locale-independent) to avoid hydration
 * mismatches: the server and client can otherwise disagree on locale-based
 * formatting like toLocaleDateString(). */
function formatCommitDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export interface RepositoryCardProps {
  title: string;
  description: string;
  url: string;
  stargazers: number;
  commitCount: number;
  lastCommitAt: string | null;
  language: string | null;
}

export function RepositoryCard({
  title,
  description,
  url,
  stargazers,
  commitCount,
  lastCommitAt,
  language,
}: RepositoryCardProps) {
  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-[#c9d1d9]">{title}</h3>
          {language && (
            <span className="text-xs px-2 py-1 rounded bg-[#21262d] text-[#c9d1d9] border border-[#30363d]">
              {language}
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-[#8b949e] leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-4 text-xs text-[#8b949e]">
        <span className="flex items-center gap-1">
          <Icon name="star" className="w-3 h-3 text-[#c9d1d9]" />
          {stargazers} stars
        </span>
        <span className="flex items-center gap-1">
          <Icon name="calendar" className="w-3 h-3 text-[#c9d1d9]" />
          {commitCount} commits
        </span>
        {lastCommitAt && (
          <span className="flex items-center gap-1">
            <Icon name="calendar" className="w-3 h-3 text-[#c9d1d9]" />
            Last: {formatCommitDate(lastCommitAt)}
          </span>
        )}
      </div>
      <div className="mt-auto">
        <Button variant="outline" size="sm" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <span className="flex items-center gap-1">
              View Repository <Icon name="external" className="w-3 h-3" />
            </span>
          </a>
        </Button>
      </div>
    </Card>
  );
}
