import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function About() {
  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-8">
          About
        </h1>
        <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
          <p>
            I&apos;m Samir Mena, a software engineer focused on building
            professional ecosystems that bridge the gap between content and code.
            My work centers on architecting scalable, accessible, and
            performant web applications using modern technologies.
          </p>
          <p>
            This portfolio is a living document of my technical journey — from
            architectural decisions and trade-offs to hands-on implementation
            details. It&apos;s built on Next.js 14, powered by Notion as a CMS,
            and secured with Upstash Redis rate limiting.
          </p>
          <p>
            I believe in documenting the reasoning behind every decision, not
            just the outcome. Each Professional Insight captures the challenges
            faced and trade-offs considered. Each Activity Log tracks the
            evolution of ideas into working systems.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-2">Tech Stack</h3>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>• Next.js 14 (App Router)</li>
              <li>• TypeScript (strict mode)</li>
              <li>• Tailwind CSS + Typography</li>
              <li>• Notion API + SDK</li>
              <li>• Upstash Redis + Ratelimit</li>
              <li>• Zod validation</li>
              <li>• Jest + Testing Library</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-white mb-2">Principles</h3>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>• Accessibility first (WCAG 2.1 AA)</li>
              <li>• Security by default (CSP, rate limiting)</li>
              <li>• Test-driven development (80%+ coverage)</li>
              <li>• Documentation as a first-class citizen</li>
              <li>• Progressive enhancement</li>
              <li>• Performance optimization</li>
            </ul>
          </Card>
        </div>

        <div className="mt-12 flex gap-4">
          <Button variant="primary" size="lg" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a
              href="https://github.com/samirmina"
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
