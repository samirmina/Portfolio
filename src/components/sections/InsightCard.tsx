import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MediaFacade } from '@/components/media/MediaFacade';

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
        <div>
          <h3 className="text-lg font-semibold text-[#c9d1d9]">{title}</h3>
          {date && (
            <time className="text-xs text-[#8b949e] mt-1 block">{date}</time>
          )}
        </div>
        <span className="text-xs px-2 py-1 rounded bg-[#238636]/10 text-[#238636] border border-[#238636]/20">
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
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#58a6ff] mt-1">•</span>
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
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
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
              className="text-xs px-2 py-1 rounded bg-[#21262d] text-[#c9d1d9] border border-[#30363d]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {videoUrl && (
        <MediaFacade src={videoUrl} alt={`Video for ${title}`} />
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
          Endorse
        </Button>
      </div>
    </Card>
  );
}
