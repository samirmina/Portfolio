'use client';

import Link from 'next/link';
import { ActivityLog } from '@/lib/normalizers';
import { MediaFacade } from '@/components/media/MediaFacade';

export function ActivityLogCard({ log }: { log: ActivityLog }) {
  return (
    <article className="group rounded-xl border border-[#30363d] bg-[#161b22] p-6 hover:border-[#58a6ff]/50 hover:bg-[#1c2128] transition-all duration-200">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#c9d1d9] group-hover:text-[#58a6ff] transition-colors">
            {log.title}
          </h3>
          {log.date && (
            <p className="text-xs text-[#8b949e] mt-1">{log.date}</p>
          )}
        </div>
        <Link
          href={`/activity/${log.id}`}
          className="text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium"
        >
          View →
        </Link>
      </div>

      <p className="text-[#8b949e] mb-4 leading-relaxed">{log.summary}</p>

      {log.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {log.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded text-xs font-medium bg-[#21262d] text-[#8b949e] border border-[#30363d]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {log.videoUrl && (
        <div className="pt-4 border-t border-[#30363d]">
          <MediaFacade src={log.videoUrl} alt={log.title} width={400} height={225} />
        </div>
      )}
    </article>
  );
}

export function ActivityLogsSection({ logs }: { logs: ActivityLog[] }) {
  if (logs.length === 0) return null;

  return (
    <section id="activity" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#c9d1d9] tracking-tight">
              Activity Log
            </h2>
            <p className="text-[#8b949e] mt-2">
              Recent explorations, builds, and learning notes
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {logs.map((log) => (
            <ActivityLogCard key={log.id} log={log} />
          ))}
        </div>
      </div>
    </section>
  );
}
