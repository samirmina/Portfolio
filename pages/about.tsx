import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function About() {
  return (
    <>
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#c9d1d9] mb-8">
          About
        </h1>
        <div className="space-y-6 text-lg text-[#8b949e] leading-relaxed">
          <p>
            I&apos;m Meena Samir Anees, a software engineer based in Cairo, Egypt.
            I specialize in Java, Spring Boot, and PostgreSQL, with a strong
            passion for clean code, backend systems, and AI integrations.
          </p>
          <p>
            My work spans multiple languages and domains — from Java and
            Spring Boot backends to TypeScript and Python projects, including
            AI-powered tools and Android development with Kotlin. I believe
            in documenting the reasoning behind every decision, not just the
            outcome.
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
            <h3 className="text-lg font-semibold text-[#c9d1d9] mb-4">Tech Stack</h3>
            <ul className="text-sm text-[#8b949e] space-y-2">
              <li>• Java & Spring Boot</li>
              <li>• PostgreSQL & Databases</li>
              <li>• TypeScript & JavaScript</li>
              <li>• Kotlin & Android</li>
              <li>• C & Systems Programming</li>
              <li>• Clean Code & Architecture</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-[#c9d1d9] mb-4">Principles</h3>
            <ul className="text-sm text-[#8b949e] space-y-2">
              <li>• Clean code and maintainability</li>
              <li>• Backend systems and APIs</li>
              <li>• AI integrations and tooling</li>
              <li>• Continuous learning and growth</li>
              <li>• Open source contributions</li>
              <li>• Professional collaboration</li>
            </ul>
          </Card>
        </div>

        <div className="mt-12 flex gap-4">
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
