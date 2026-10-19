import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Layout } from '@/components/layout/Layout';
import { ActivityLogCard } from '@/components/sections/ActivityLogCard';
import { InsightCard } from '@/components/sections/InsightCard';
import { RepositoryCard } from '@/components/sections/RepositoryCard';

// Mock data for display purposes — in production this comes from Notion
const activityLogs = [
  {
    id: '1',
    title: 'Building a Notion-Backed Portfolio',
    summary:
      'Designed and implemented a full-stack portfolio ecosystem powered by Notion as the CMS, Next.js 14 App Router, and Upstash Redis for rate limiting. Achieved 82% test coverage with 66 passing tests.',
    tags: ['nextjs', 'notion', 'upstash', 'architecture'],
    videoUrl: null,
    approvals: 12,
    date: '2026-09-15',
  },
  {
    id: '2',
    title: 'WCAG 2.1 AA Accessibility Audit',
    summary:
      'Conducted a comprehensive accessibility review, implementing focus rings, high-contrast color palettes, and keyboard navigation across all interactive components.',
    tags: ['accessibility', 'wcag', 'a11y'],
    videoUrl: null,
    approvals: 8,
    date: '2026-09-10',
  },
];

const insights = [
  {
    id: '1',
    title: 'SSG vs ISR vs SSR Trade-offs',
    context:
      'Evaluated rendering strategies for a portfolio site with content sourced from Notion. SSG provides fastest delivery; ISR adds freshness at build complexity; SSR adds server load.',
    challenges: [
      'Build time vs freshness balance',
      'Cache invalidation complexity',
      'Notion API rate limits',
    ],
    tradeOffs: [
      'SSG: fastest TTFB, stale content',
      'ISR: fresh content, build complexity',
      'SSR: always fresh, server load',
    ],
    tags: ['architecture', 'rendering', 'performance'],
    videoUrl: null,
    approvals: 15,
    date: '2026-08-20',
  },
];

const repositories = [
  {
    title: 'Portfolio Website',
    repoName: 'portfolio',
    description:
      'Professional ecosystem portfolio built on Next.js 14, Notion CMS, and Upstash Redis. Features Activity Logs, Professional Insights, Direct Line feedback, and GitHub repository showcase.',
    url: 'https://github.com/samirmina/Portfolio',
    stargazers: 0,
    commitCount: 127,
    lastCommitAt: '2026-10-19',
    language: 'TypeScript',
  },
];

export default function Home() {
  return (
    <Layout>
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
              Notion, and modern web technologies. Documenting insights,
              tracking activity, and connecting with the community.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More</Link>
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activityLogs.map((log) => (
            <ActivityLogCard key={log.id} {...log} />
          ))}
        </div>
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
        </div>
        <div className="grid grid-cols-1 gap-6">
          {insights.map((insight) => (
            <InsightCard key={insight.id} {...insight} />
          ))}
        </div>
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo) => (
            <RepositoryCard key={repo.repoName} {...repo} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center py-12 px-8 bg-gradient-to-r from-teal-500/10 to-slate-900/50">
          <h2 className="text-3xl font-bold text-white mb-4">
            Let&apos;s Connect
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Have a project in mind or want to discuss architecture? Reach out
            through the Direct Line.
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </Card>
      </section>
    </Layout>
  );
}
