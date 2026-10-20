import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchActivityLogs, fetchPageWithBlocks } from '@/lib/adapters/notion';
import { extractTitle, extractRichText } from '@/lib/normalizers';

interface ActivityPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const logs = await fetchActivityLogs();
  return logs.map((log) => ({ id: log.id }));
}

export async function generateMetadata({
  params,
}: ActivityPageProps): Promise<Metadata> {
  const { page } = await fetchPageWithBlocks(params.id);
  const title = extractTitle(
    (page.properties as Record<string, unknown>).Title as {
      title?: { plain_text: string }[];
    } | null
  );
  return {
    title: title ? `${title} — Activity Log` : 'Activity Log',
    description: extractRichText(
      (page.properties as Record<string, unknown>).Summary as {
        rich_text?: { plain_text: string }[];
      } | null
    ),
  };
}

function renderBlocks(blocks: Record<string, unknown>[]) {
  return blocks.map((block, index) => {
    const type = block.type as string;
    const content = (block as Record<string, unknown>)[type] as
      | Record<string, unknown>
      | undefined;

    switch (type) {
      case 'paragraph': {
        const text = (content?.rich_text as { plain_text: string }[]) ?? [];
        return (
          <p key={index} className="mb-4 text-[#8b949e] leading-relaxed">
            {text.map((t) => t.plain_text).join('')}
          </p>
        );
      }
      case 'heading_2': {
        const text = (content?.rich_text as { plain_text: string }[]) ?? [];
        return (
          <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
            {text.map((t) => t.plain_text).join('')}
          </h2>
        );
      }
      case 'heading_3': {
        const text = (content?.rich_text as { plain_text: string }[]) ?? [];
        return (
          <h3 key={index} className="text-xl font-semibold text-[#c9d1d9] mt-6 mb-3">
            {text.map((t) => t.plain_text).join('')}
          </h3>
        );
      }
      case 'bulleted_list_item': {
        const text = (content?.rich_text as { plain_text: string }[]) ?? [];
        return (
          <li key={index} className="ml-6 list-disc text-[#8b949e] leading-relaxed">
            {text.map((t) => t.plain_text).join('')}
          </li>
        );
      }
      case 'numbered_list_item': {
        const text = (content?.rich_text as { plain_text: string }[]) ?? [];
        return (
          <li key={index} className="ml-6 list-decimal text-[#8b949e] leading-relaxed">
            {text.map((t) => t.plain_text).join('')}
          </li>
        );
      }
      case 'code': {
        const text = (content?.rich_text as { plain_text: string }[]) ?? [];
        const language = (content?.language as string) ?? '';
        return (
          <pre key={index} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 my-4 overflow-x-auto">
            <code className="text-sm text-[#c9d1d9] font-mono">
              {language ? `// ${language}\n` : ''}{text.map((t) => t.plain_text).join('')}
            </code>
          </pre>
        );
      }
      case 'quote': {
        const text = (content?.rich_text as { plain_text: string }[]) ?? [];
        return (
          <blockquote key={index} className="border-l-4 border-[#58a6ff] pl-4 italic text-[#8b949e] my-4">
            {text.map((t) => t.plain_text).join('')}
          </blockquote>
        );
      }
      case 'divider': {
        return <hr key={index} className="border-[#30363d] my-8" />;
      }
      case 'to_do': {
        const text = (content?.rich_text as { plain_text: string }[]) ?? [];
        const checked = content?.checked as boolean;
        return (
          <div key={index} className="flex items-start gap-3 my-2 text-[#8b949e]">
            <span className="mt-1">{checked ? '☑' : '☐'}</span>
            <span className="leading-relaxed">{text.map((t) => t.plain_text).join('')}</span>
          </div>
        );
      }
      default: {
        const text = (content?.rich_text as { plain_text: string }[]) ?? [];
        if (!text.length) return null;
        return (
          <p key={index} className="mb-4 text-[#8b949e] leading-relaxed">
            {text.map((t) => t.plain_text).join('')}
          </p>
        );
      }
    }
  });
}

export default async function ActivityDetailPage({ params }: ActivityPageProps) {
  let page: Record<string, unknown>;
  let blocks: Record<string, unknown>[];
  try {
    ({ page, blocks } = await fetchPageWithBlocks(params.id));
  } catch {
    notFound();
  }

  const properties = page.properties as Record<string, unknown>;
  const title = extractTitle(properties.Title as { title?: { plain_text: string }[] } | null);
  const summary = extractRichText(properties.Summary as { rich_text?: { plain_text: string }[] } | null);
  const date = (properties.Date as { date?: { start?: string | null } | null } | null)?.date?.start ?? null;

  if (!title) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
      <Link
        href="/activity"
        className="inline-flex items-center gap-2 text-sm text-[#58a6ff] hover:text-[#79c0ff] mb-8 transition-colors"
      >
        ← Back to Activity Log
      </Link>

      <article className="space-y-6">
        <header>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            {title}
          </h1>
          {date && (
            <time className="text-sm text-[#8b949e]">{date}</time>
          )}
        </header>

        {summary && (
          <p className="text-lg text-[#8b949e] leading-relaxed border-l-4 border-[#58a6ff] pl-4">
            {summary}
          </p>
        )}

        <div className="prose prose-invert max-w-none mt-8">
          {renderBlocks(blocks)}
        </div>
      </article>
    </div>
  );
}