'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { MediaFacade } from '@/components/media/MediaFacade';
import Link from 'next/link';

export interface InsightCardProps {
  id: string;
  title: string;
  context: string;
  challenges: string[];
  tradeOffs: string[];
  tags: string[];
  videoUrl: string | null;
  approvals: number;
  date: string | null;
}

export function InsightCard({
  id,
  title,
  context,
  challenges,
  tradeOffs,
  tags,
  videoUrl,
  approvals,
  date,
}: InsightCardProps) {
  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link href={`/insights/${id}`} className="hover:underline">
            <h3 className="text-lg font-semibold text-[#c9d1d9] hover:text-[#58a6ff] transition-colors">
              {title}
            </h3>
          </Link>
          {date && (
            <div className="flex items-center gap-1 text-xs text-[#8b949e] mt-1">
              <Icon name="calendar" className="w-3 h-3" />
              <time>{date}</time>
            </div>
          )}
        </div>
        <span className="text-xs px-2 py-1 rounded bg-[#238636]/10 text-[#238636] border border-[#238636]/20">
          <Icon name="star" className="w-3 h-3 mr-0.5" />
          {approvals} endorsements
        </span>
      </div>
      <p className="text-sm text-[#8b949e] leading-relaxed">{context}</p>
      {challenges.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
            Challenges
          </h4>
          <ul className="text-sm text-[#8b949e] space-y-1">
            {challenges.map((c, i) => (
              <li key={i} className="flex items-start gap-1">
                <Icon name="tag" className="w-3 h-3 mt-0.5 text-[#58a6ff]" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
      {tradeOffs.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
            Trade-offs
          </h4>
          <ul className="text-sm text-[#8b949e] space-y-1">
            {tradeOffs.map((t, i) => (
              <li key={i} className="flex items-start gap-1">
                <Icon name="tag" className="w-3 h-3 mt-0.5 text-amber-500" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-[#21262d] text-[#c9d1d9] border border-[#30363d]"
            >
              <Icon name="tag" className="w-3 h-3 mr-0.5" />
              {tag}
            </span>
          ))}
        </div>
      )}
      {videoUrl && (
        <div className="flex items-center gap-1 text-xs text-[#c9d1d9]">
          <Icon name="video" className="w-3 h-3" />
          <MediaFacade src={videoUrl} alt={`Video for ${title}`} />
        </div>
      )}
      <div className="mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            fetch('/api/endorse', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                targetDb: 'ProfessionalInsights',
                targetId: id,
              }),
            })
          }
        >
          <span className="flex items-center gap-1">
            <Icon name="star" className="w-3 h-3" />
            Endorse
          </span>
        </Button>
      </div>
    </Card>
  );
}
