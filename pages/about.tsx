import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function About() {
  return (
    <>
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-28">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-16 animate-fade-in tracking-tight">
          About
        </h1>
        <div className="space-y-10 text-lg text-[#8b949e] leading-relaxed">
          <p>
            I&apos;m Meena Samir Anees, a software engineer based in Cairo, Egypt.
            I specialize in Java, Spring Boot, and PostgreSQL, with a strong
            passion for clean code, backend systems, and AI integrations.
          </p>
          <p>
            My work spans desktop applications, browser extensions, and backend
            systems — from offline-first translation tools and AI-powered book
            extractors to Zendesk automation extensions and code analysis
            platforms. I build practical, production-ready software that solves
            real problems.
          </p>
          <p>
            I believe in documenting the reasoning behind every decision, not
            just the outcome. Each project reflects careful architectural
            choices, from offline-first design to multi-service Docker
            deployments.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-10">
          <Card>
            <h3 className="text-lg font-semibold text-[#c9d1d9] mb-6">Core Expertise</h3>
            <ul className="text-sm text-[#8b949e] space-y-2">
              <li>• Java 21 & Spring Boot</li>
              <li>• PostgreSQL & pgvector</li>
              <li>• JavaFX Desktop Applications</li>
              <li>• AI Integrations (Ollama, LLMs)</li>
              <li>• Browser Extensions (Chrome/Edge)</li>
              <li>• Docker & Containerization</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-[#c9d1d9] mb-6">Key Projects</h3>
            <ul className="text-sm text-[#8b949e] space-y-2">
              <li>• BookMind Nexus — AI PDF extraction (Java/Spring Boot)</li>
              <li>• LLL Verifier — Offline translation tool (Java/Spring Boot/JavaFX)</li>
              <li>• CodeInsight Analyzer — Code analysis platform (Kotlin/Ktor)</li>
              <li>• Chronos — Pomodoro task manager (Java/JavaFX)</li>
              <li>• Gek — Voice translation desktop app (Python)</li>
              <li>• Zendesk extensions (JavaScript)</li>
            </ul>
          </Card>
        </div>

        <div className="mt-20 flex gap-4">
          <Button variant="primary" size="lg" asChild>
            <Link href="/contact">Contact Me</Link>
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
    </>
  );
}
