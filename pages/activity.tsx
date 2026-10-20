
import { ActivityLogCard } from '@/components/sections/ActivityLogCard';
import { fetchActivityLogs } from '@/lib/adapters/notion';
import type { ActivityLog } from '@/lib/normalizers';

export async function getStaticProps() {
  try {
    const logs = await fetchActivityLogs();
    return {
      props: { logs },
      revalidate: 3600,
    };
  } catch {
    return {
      props: { logs: [] },
      revalidate: 60,
    };
  }
}

interface ActivityPageProps {
  logs: ActivityLog[];
}

export default function ActivityPage({ logs }: ActivityPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#c9d1d9] mb-4">
          Activity Log
        </h1>
        <p className="text-lg text-[#8b949e] max-w-2xl">
          Recent explorations, builds, and learning notes.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#8b949e] text-lg">
            No activity logs available at this time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {logs.map((log) => (
            <ActivityLogCard key={log.id} {...log} />
          ))}
        </div>
      )}
    </div>
  );
}
