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
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {date && (
            <time className="text-xs text-slate-500 mt-1 block">{date}</time>
          )}
        </div>
        <span className="text-xs px-2 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
          {approvals} endorsements
        </span>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{context}</p>
      {challenges.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Challenges
          </h4>
          <ul className="text-sm text-slate-400 space-y-1">
            {challenges.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
      {tradeOffs.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Trade-offs
          </h4>
          <ul className="text-sm text-slate-400 space-y-1">
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
              className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700"
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
