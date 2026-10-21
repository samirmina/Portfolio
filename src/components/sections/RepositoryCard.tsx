import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
  commitCount,
  lastCommitAt,
  language,
}: RepositoryCardProps) {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-[#c9d1d9]">{title}</h3>
      <p className="text-sm text-[#8b949e] leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {language && (
          <span className="px-2 py-1 rounded-full bg-[#21262d] border border-[#30363d] text-xs text-[#c9d1d9]">
            {language}
          </span>
        )}
        <span className="text-xs text-[#58a6ff]">{commitCount} commits</span>
        {lastCommitAt && (
          <span className="text-xs text-[#8b949e]">{formatCommitDate(lastCommitAt)}</span>
        )}
      </div>
      <Button variant="outline" size="sm" asChild className="w-fit">
        <a href={url} target="_blank" rel="noopener noreferrer">
          View
        </a>
      </Button>
    </Card>
  );
}
