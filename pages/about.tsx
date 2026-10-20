import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function About() {
  return (
    <>
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-10 tracking-tight">
          About
        </h1>
        <div className="space-y-8 text-lg text-[#8b949e] leading-relaxed">
          <p>
            I&apos;m Mina Samir Anis Aziz, a software engineer based in Cairo, Egypt.
            I specialize in Java, Spring Boot, and PostgreSQL, with 5+ years of
            domain experience across International Banking and Global E-Commerce
            Operations.
          </p>
          <p>
            My background spans HSBC Bank Egypt, Euro Exim Bank, and the National
            Bank of Egypt, where I managed corporate banking operations, trade
            finance, and quality auditing. I also worked in customer support
            operations for Vodafone UK, Teleperformance (eBay German account),
            and VXI Global Solutions (AliExpress Dutch account).
          </p>
          <p>
            I combine rigorous self-directed engineering studies — grounded in
            industry benchmarks like Effective Java, Spring Starts Now, and Head
            First Java — with hands-on experience building production-grade
            Spring Boot microservices, RAG architectures, and AST code analyzers.
          </p>
          <p>
            I&apos;m multilingual: Dutch (C1), German (C1), English (C2), and
            Arabic (Native). Available for remote B2B contracting or European
            relocation.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-6">Core Expertise</h3>
            <ul className="text-sm text-[#8b949e] space-y-3">
              <li>• Java 21 & Spring Boot 3.5</li>
              <li>• PostgreSQL & pgvector (RAG)</li>
              <li>• JavaFX Desktop Applications</li>
              <li>• AI Integrations (Ollama, LLMs)</li>
              <li>• Kotlin & Ktor</li>
              <li>• Docker Compose & DevOps</li>
              <li>• Clean Architecture & SOLID</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-white mb-6">Key Projects</h3>
            <ul className="text-sm text-[#8b949e] space-y-3">
              <li>• BookMind Nexus — AI PDF extraction (Java/Spring Boot)</li>
              <li>• LLL Verifier — Offline translation tool (Java/Spring Boot/JavaFX)</li>
              <li>• CodeInsight Analyzer — Code analysis platform (Kotlin/Ktor)</li>
              <li>• Chronos — Pomodoro task manager (Java/JavaFX)</li>
              <li>• Gek — Voice translation desktop app (Python)</li>
              <li>• Zendesk extensions (JavaScript)</li>
            </ul>
          </Card>
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
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
