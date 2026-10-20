import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface RepositoryCardProps {
  title: string;
  repoName: string;
  description: string;
  url: string;
  stargazers: number;
  commitCount: number;
  lastCommitAt: string | null;
  language: string | null;
}

export function RepositoryCard({
  title,
  repoName,
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
        <div>
          <h3 className="text-lg font-semibold text-[#c9d1d9]">{title}</h3>
          <p className="text-xs text-[#8b949e] mt-1">{repoName}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-[#21262d] text-[#c9d1d9] border border-[#30363d]">
          {language ?? 'N/A'}
        </span>
      </div>
      <p className="text-sm text-[#8b949e] leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-4 text-xs text-[#8b949e]">
        <span>⭐ {stargazers} stars</span>
        <span>📝 {commitCount} commits</span>
        {lastCommitAt && (
          <span>📅 Last: {new Date(lastCommitAt).toLocaleDateString()}</span>
        )}
      </div>
      <div className="mt-auto">
        <Button variant="outline" size="sm" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            View Repository
          </a>
        </Button>
      </div>
    </Card>
  );
}
