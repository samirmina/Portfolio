import { InsightCard } from '@/components/sections/InsightCard';
import { fetchProfessionalInsights } from '@/lib/adapters/notion';
import type { ProfessionalInsight } from '@/lib/normalizers';

export async function getStaticProps() {
  try {
    const insights = await fetchProfessionalInsights();
    return {
      props: { insights },
      revalidate: 3600,
    };
  } catch {
    return {
      props: { insights: [] },
      revalidate: 60,
    };
  }
}

interface InsightsPageProps {
  insights: ProfessionalInsight[];
}

export default function InsightsPage({ insights }: InsightsPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#c9d1d9] mb-4">
          Professional Insights
        </h1>
        <p className="text-lg text-[#8b949e] max-w-2xl">
          Trade-offs, challenges, and architectural decisions — synced from Notion.
        </p>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#8b949e] text-lg">
            No insights found. Check your Notion connection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {insights.map((insight) => (
            <InsightCard key={insight.id} {...insight} />
          ))}
        </div>
      )}
    </div>
  );
}
