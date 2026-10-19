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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-slate-950 to-slate-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6">
              Samir Mena
            </h1>
            <p className="text-xl sm:text-2xl text-slate-400 mb-8 leading-relaxed">
              Software Engineer building professional ecosystems with Next.js,
              Notion, and modern web technologies.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg" asChild>
                <Link href="/contact">Contact Me</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/activity">View Activity</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Logs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Activity Logs</h2>
            <p className="text-slate-400 mt-2">
              Recent work, explorations, and technical deep-dives.
            </p>
          </div>
          <Link
            href="/activity"
            className="text-teal-400 hover:text-teal-300 text-sm font-medium"
          >
            View all →
          </Link>
        </div>
        {logs.length === 0 ? (
          <p className="text-slate-500">No activity logs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {logs.map((log) => (
              <ActivityLogCard key={log.id} {...log} />
            ))}
          </div>
        )}
      </section>

      {/* Professional Insights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Professional Insights</h2>
            <p className="text-slate-400 mt-2">
              Trade-offs, challenges, and architectural decisions.
            </p>
          </div>
          <Link
            href="/insights"
            className="text-teal-400 hover:text-teal-300 text-sm font-medium"
          >
            View all →
          </Link>
        </div>
        {insights.length === 0 ? (
          <p className="text-slate-500">No insights found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {insights.map((insight) => (
              <InsightCard key={insight.id} {...insight} />
            ))}
          </div>
        )}
      </section>

      {/* GitHub Repositories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">GitHub Repositories</h2>
            <p className="text-slate-400 mt-2">
              Open-source projects and contributions.
            </p>
          </div>
          <Link
            href="/repositories"
            className="text-teal-400 hover:text-teal-300 text-sm font-medium"
          >
            View all →
          </Link>
        </div>
        {repositories.length === 0 ? (
          <p className="text-slate-500">No repositories found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo) => (
              <RepositoryCard key={repo.repoName} {...repo} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
