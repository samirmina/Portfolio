import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function About() {
  const expertise = [
    'Java 21 & Spring Boot 3.5',
    'PostgreSQL & pgvector (RAG)',
    'JavaFX Desktop Applications',
    'AI Integrations (Ollama, LLMs)',
    'Kotlin & Ktor',
    'Docker Compose & DevOps',
    'Clean Architecture & SOLID',
  ];

  const projects = [
    {
      title: 'BookMind Nexus',
      description: 'AI PDF extraction',
      url: 'https://github.com/samirmina/bookmind-nexus',
    },
    {
      title: 'LLL Verifier',
      description: 'Offline translation tool',
      url: 'https://github.com/samirmina/lll-verifier',
    },
    {
      title: 'CodeInsight Analyzer',
      description: 'Code analysis platform',
      url: 'https://github.com/samirmina/codeinsight-analyzer',
    },
    {
      title: 'Chronos',
      description: 'Pomodoro task manager',
      url: 'https://github.com/samirmina/chronos',
    },
    {
      title: 'Gek',
      description: 'Voice translation desktop app',
      url: 'https://github.com/samirmina/gek',
    },
    {
      title: 'Zendesk Extensions',
      description: 'Browser extensions',
      url: 'https://github.com/samirmina/zendesk-extensions',
    },
  ];

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
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Core Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {expertise.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-[#21262d] border border-[#30363d] text-xs text-[#c9d1d9]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Key Projects</h3>
            <div className="space-y-3">
              {projects.map((project) => (
                <Link
                  key={project.title}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="p-4 hover:bg-[#161b22]/50 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white group-hover:text-[#58a6ff] transition-colors">
                          {project.title}
                        </h4>
                        <p className="text-xs text-[#8b949e] mt-0.5">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
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
