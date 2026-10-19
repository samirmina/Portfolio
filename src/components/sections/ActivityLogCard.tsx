import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MediaFacade } from '@/components/media/MediaFacade';

export interface ActivityLogCardProps {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  videoUrl: string | null;
  approvals: number;
  date: string | null;
}

export function ActivityLogCard({
  id,
  title,
  summary,
  tags,
  videoUrl,
  approvals,
  date,
}: ActivityLogCardProps) {
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
      <p className="text-sm text-slate-400 leading-relaxed">{summary}</p>
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
                targetDb: 'ActivityLogs',
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
