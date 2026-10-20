import Link from 'next/link';
import { Button } from '@/components/ui/Button';
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
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-[#58a6ff] mb-4 uppercase tracking-wider">
              Software Engineer
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Meena Samir Anees
            </h1>
            <p className="text-lg text-[#8b949e] mb-10 leading-relaxed max-w-2xl">
              Software Engineer based in Cairo, Egypt. Specializing in
              Java, Spring Boot, and PostgreSQL — building desktop
              applications, AI-powered tools, browser extensions, and
              backend systems across multiple languages and domains.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/activity">View Activity</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Logs Section */}
      <section className="">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Activity Logs
              </h2>
              <p className="text-sm text-[#8b949e]">
                Recent explorations, builds, and learning notes
              </p>
            </div>
            <Link
              href="/activity"
              className="text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          {logs.length === 0 ? (
            <p className="text-[#8b949e] py-8">No activity logs found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {logs.map((log) => (
                <ActivityLogCard key={log.id} {...log} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Professional Insights Section */}
      <section className="">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Professional Insights
              </h2>
              <p className="text-sm text-[#8b949e]">
                Technical deep-dives and architectural decisions
              </p>
            </div>
            <Link
              href="/insights"
              className="text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          {insights.length === 0 ? (
            <p className="text-[#8b949e] py-8">No insights found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {insights.map((insight) => (
                <InsightCard key={insight.id} {...insight} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GitHub Repositories Section */}
      <section>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                GitHub Repositories
              </h2>
              <p className="text-sm text-[#8b949e]">
                Public repositories from GitHub
              </p>
            </div>
            <Link
              href="/repositories"
              className="text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          <RepositoryCarousel repositories={repositories} />
        </div>
      </section>
    </div>
  );
}
