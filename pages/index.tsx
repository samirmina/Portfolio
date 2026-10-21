import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { SearchField } from '@/components/ui/SearchField';
import { ActivityLogCard } from '@/components/sections/ActivityLogCard';
import { InsightCard } from '@/components/sections/InsightCard';
import { RepositoryCard } from '@/components/sections/RepositoryCard';
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
    description: string;
    url: string;
    stargazers: number;
    commitCount: number;
    lastCommitAt: string | null;
    language: string | null;
  }[];
}

function matchesQuery(item: { title: string; description?: string; summary?: string; context?: string; tags?: string[] }, query: string): boolean {
  const q = query.toLowerCase();
  const text = [
    item.title,
    item.summary,
    item.context,
    item.description,
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return text.includes(q);
}

export default function Home({ logs, insights, repositories }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const filteredLogs = useMemo(
    () => logs.filter((log) => matchesQuery(log, searchQuery)),
    [logs, searchQuery]
  );
  const filteredInsights = useMemo(
    () => insights.filter((insight) => matchesQuery(insight, searchQuery)),
    [insights, searchQuery]
  );
  const filteredRepositories = useMemo(
    () => repositories.filter((repo) => matchesQuery(repo, searchQuery)),
    [repositories, searchQuery]
  );

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      setSearching(true);
      try {
        await fetch('/api/search-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: query }),
        });
      } catch {
        // Fail silently: search still works locally even if Notion write fails
      } finally {
        setSearching(false);
      }
    },
    []
  );

  const hasResults = searchQuery
    ? filteredLogs.length > 0 || filteredInsights.length > 0 || filteredRepositories.length > 0
    : true;

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 space-y-4">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 ">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
          <div className="space-y-6 max-w-3xl animate-fade-in">
            <p className="text-sm font-medium text-[#58a6ff] uppercase tracking-widest">
              Software Engineer
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight">
              Mina Samir Anis Aziz
            </h1>
            <p className="text-xl text-[#8b949e] leading-relaxed max-w-2xl">
              Software Engineer based in Cairo, Egypt. Specializing in Java,
              Spring Boot, and PostgreSQL — with 5+ years across International
              Banking and E-Commerce. Building desktop applications, AI-powered
              tools, browser extensions, and backend systems.
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

      {/* Search — explanatory text for each section is embedded inside the field. */}
      <SearchField
        hints={[
          { label: 'Activity Logs', text: 'Recent explorations, builds, and learning notes.' },
          { label: 'Professional Insights', text: 'Technical deep-dives and architectural decisions.' },
          { label: 'GitHub Repositories', text: 'Public repositories from GitHub.' },
        ]}
        onSearch={handleSearch}
      />

      {/* Search results message */}
      {searchQuery && (
        <div className="text-sm text-[#8b949e] mb-4">
          {searching ? 'Searching...' : hasResults ? `Showing results for "${searchQuery}"` : `No results for "${searchQuery}"`}
        </div>
      )}

      {/* Activity Logs Section */}
      <Section title="Activity Logs" viewAllHref="/activity">
        {searchQuery ? (
          filteredLogs.length === 0 ? (
            <Card>
              <p className="text-[#8b949e]">No matching activity logs.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredLogs.map((log) => (
                <ActivityLogCard key={log.id} {...log} />
              ))}
            </div>
          )
        ) : (
          logs.length === 0 ? (
            <Card>
              <p className="text-[#8b949e]">No activity logs available at this time.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {logs.map((log) => (
                <ActivityLogCard key={log.id} {...log} />
              ))}
            </div>
          )
        )}
      </Section>

      {/* Professional Insights Section */}
      <Section title="Professional Insights" viewAllHref="/insights">
        {searchQuery ? (
          filteredInsights.length === 0 ? (
            <Card>
              <p className="text-[#8b949e]">No matching insights.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {filteredInsights.map((insight) => (
                <InsightCard key={insight.id} {...insight} />
              ))}
            </div>
          )
        ) : (
          insights.length === 0 ? (
            <Card>
              <p className="text-[#8b949e]">No insights available at this time.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {insights.map((insight) => (
                <InsightCard key={insight.id} {...insight} />
              ))}
            </div>
          )
        )}
      </Section>

      {/* GitHub Repositories Section */}
      <Section title="GitHub Repositories" viewAllHref="/repositories">
        {searchQuery ? (
          filteredRepositories.length === 0 ? (
            <Card>
              <p className="text-[#8b949e]">No matching repositories.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRepositories.map((repo) => (
                <RepositoryCard key={repo.title} {...repo} />
              ))}
            </div>
          )
        ) : (
          repositories.length === 0 ? (
            <Card>
              <p className="text-[#8b949e]">No repositories available at this time.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {repositories.map((repo) => (
                <RepositoryCard key={repo.title} {...repo} />
              ))}
            </div>
          )
        )}
      </Section>
    </div>
  );
}
