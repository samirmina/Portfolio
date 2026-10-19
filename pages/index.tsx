import Link from 'next/link';
import { Button } from '@/components/ui/Button';

import { ActivityLogCard } from '@/components/sections/ActivityLogCard';
import { InsightCard } from '@/components/sections/InsightCard';
import { RepositoryCard } from '@/components/sections/RepositoryCard';
import { fetchActivityLogs } from '@/lib/adapters/notion';
import { fetchProfessionalInsights } from '@/lib/adapters/notion';
import { fetchRepositories } from '@/lib/adapters/notion';
import { enrichRepository } from '@/lib/adapters/github';

export async function getStaticProps() {
  try {
    const [logs, insights, repos] = await Promise.all([
      fetchActivityLogs(),
      fetchProfessionalInsights(),
      fetchRepositories(),
    ]);

    const enrichedRepos = await Promise.all(
      repos.map(async (repo) => {
        const gh = await enrichRepository({
          repoName: repo.repoName,
          url: repo.url,
        });
        return {
          title: repo.title,
          repoName: repo.repoName,
          description: repo.description || gh.description || '',
          url: repo.url || gh.htmlUrl || '',
          stargazers: gh.stargazersCount ?? repo.stargazers,
          commitCount: gh.commitCount ?? repo.commitCount,
          lastCommitAt: gh.lastCommitAt ?? repo.lastCommitAt,
          language: gh.language ?? repo.language,
        };
      })
    );

    return {
      props: {
        logs: logs.slice(0, 4),
        insights: insights.slice(0, 2),
        repositories: enrichedRepos.slice(0, 3),
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
    <>
      {/* Hero Section */}
      <section className="border-b border-[#30363d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Samir Mena
            </h1>
            <p className="text-lg text-[#8b949e] mb-6 leading-relaxed">
              Software Engineer building professional ecosystems with Next.js,
              Notion, and modern web technologies.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="md" asChild>
                <Link href="/contact">Contact Me</Link>
              </Button>
              <Button variant="outline" size="md" asChild>
                <Link href="/activity">View Activity</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Logs Section */}
      <section className="border-b border-[#30363d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Activity Logs</h2>
            <Link
              href="/activity"
              className="text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          {logs.length === 0 ? (
            <p className="text-[#8b949e]">No activity logs found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {logs.map((log) => (
                <ActivityLogCard key={log.id} {...log} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Professional Insights Section */}
      <section className="border-b border-[#30363d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Professional Insights
            </h2>
            <Link
              href="/insights"
              className="text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          {insights.length === 0 ? (
            <p className="text-[#8b949e]">No insights found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {insights.map((insight) => (
                <InsightCard key={insight.id} {...insight} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GitHub Repositories Section */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              GitHub Repositories
            </h2>
            <Link
              href="/repositories"
              className="text-[#58a6ff] hover:text-[#79c0ff] text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          {repositories.length === 0 ? (
            <p className="text-[#8b949e]">No repositories found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repositories.map((repo) => (
                <RepositoryCard key={repo.repoName} {...repo} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
