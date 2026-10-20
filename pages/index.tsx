import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
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
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 space-y-4">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
          <div className="space-y-6 max-w-3xl">
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
          <div className="flex flex-col gap-4 lg:pb-2">
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
      <Section
        title="Activity Logs"
        subtitle="Recent explorations, builds, and learning notes"
        viewAllHref="/activity"
      >
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
      </Section>

      {/* Professional Insights Section */}
      <Section
        title="Professional Insights"
        subtitle="Technical deep-dives and architectural decisions"
        viewAllHref="/insights"
      >
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
      </Section>

      {/* GitHub Repositories Section */}
      <Section
        title="GitHub Repositories"
        subtitle="Public repositories from GitHub"
        viewAllHref="/repositories"
      >
        <RepositoryCarousel repositories={repositories} />
      </Section>
    </div>
  );
}
