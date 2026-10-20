import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ActivityLogCard } from '@/components/sections/ActivityLogCard';
import { InsightCard } from '@/components/sections/InsightCard';
import { RepositoryCarousel } from '@/components/sections/RepositoryCarousel';
import { fetchActivityLogs } from '@/lib/adapters/notion';
import { fetchProfessionalInsights } from '@/lib/adapters/notion';
import { fetchUserRepositories } from '@/lib/adapters/github';

export async function getStaticProps() {
  try {
    const [logs, insights, repos] = await Promise.all([
      fetchActivityLogs(),
      fetchProfessionalInsights(),
      fetchUserRepositories(),
    ]);

    const repositories = repos.map((repo) => ({
      title: repo.name,
      repoName: repo.name,
      description: repo.description || 'No description provided.',
      url: repo.htmlUrl,
      stargazers: repo.stargazersCount,
      commitCount: repo.commitCount,
      lastCommitAt: repo.lastCommitAt,
      language: repo.language,
    }));

    return {
      props: {
        logs: logs.slice(0, 4),
        insights: insights.slice(0, 2),
        repositories,
      },
      revalidate: 3600,
    };
  } catch {
    return {
      props: { logs: [], insights: [], repositories: [] },
      revalidate: 60,
    };
  }
}

interface HomePageProps {
  logs: {
    id: string;
    title: string;
    summary: string;
    tags: string[];
    videoUrl: string | null;
    approvals: number;
    date: string | null;
  }[];
  insights: {
    id: string;
    title: string;
    context: string;
    challenges: string[];
    tradeOffs: string[];
    tags: string[];
    videoUrl: string | null;
    approvals: number;
    date: string | null;
  }[];
  repositories: {
    title: string;
    repoName: string;
    description: string;
    url: string;
    stargazers: number;
    commitCount: number;
    lastCommitAt: string | null;
    language: string | null;
  }[];
}

export default function Home({ logs, insights, repositories }: HomePageProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 space-y-16">
      {/* Hero Section */}
      <section className="animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <p className="text-sm font-medium text-[#58a6ff] uppercase tracking-widest">
              Software Engineer
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight">
              Meena Samir Anees
            </h1>
            <p className="text-xl text-[#8b949e] leading-relaxed max-w-2xl">
              Software Engineer based in Cairo, Egypt. Specializing in Java,
              Spring Boot, and PostgreSQL — building desktop applications,
              AI-powered tools, browser extensions, and backend systems across
              multiple languages and domains.
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:pt-12">
            <Button variant="primary" size="lg" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/activity">View Activity</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Activity Logs Section */}
      <section className="animate-slide-up">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">
            Activity Logs
          </h2>
          <p className="text-base text-[#8b949e]">
            Recent explorations, builds, and learning notes
          </p>
        </div>
        {logs.length === 0 ? (
          <Card>
            <p className="text-[#8b949e]">No activity logs available at this time.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {logs.map((log) => (
              <ActivityLogCard key={log.id} {...log} />
            ))}
          </div>
        )}
        <div className="mt-6">
          <Link
            href="/activity"
            className="text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium transition-colors"
          >
            View all activity logs →
          </Link>
        </div>
      </section>

      {/* Professional Insights Section */}
      <section className="animate-slide-up">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">
            Professional Insights
          </h2>
          <p className="text-base text-[#8b949e]">
            Technical deep-dives and architectural decisions
          </p>
        </div>
        {insights.length === 0 ? (
          <Card>
            <p className="text-[#8b949e]">No insights available at this time.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {insights.map((insight) => (
              <InsightCard key={insight.id} {...insight} />
            ))}
          </div>
        )}
        <div className="mt-6">
          <Link
            href="/insights"
            className="text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium transition-colors"
          >
            View all insights →
          </Link>
        </div>
      </section>

      {/* GitHub Repositories Section */}
      <section className="animate-slide-up">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">
            GitHub Repositories
          </h2>
          <p className="text-base text-[#8b949e]">
            Public repositories from GitHub
          </p>
        </div>
        <RepositoryCarousel repositories={repositories} />
        <div className="mt-6">
          <Link
            href="/repositories"
            className="text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium transition-colors"
          >
            View all repositories →
          </Link>
        </div>
      </section>
    </div>
  );
}
