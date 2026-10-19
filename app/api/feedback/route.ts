export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '../../../lib/env';
import { createRateLimiter } from '../../../src/lib/redis';
import { resolveClientIp } from '../../../src/lib/ip';
import { notion } from '../../../src/lib/notion';

const feedbackRateLimiter = createRateLimiter(3, 3600); // 3 req/IP/hour

const feedbackSchema = z.object({
  messageTitle: z.string().min(1).max(200),
  messageBody: z.string().min(1).max(5000),
  authorName: z.string().min(1).max(100),
  authorContact: z.string().min(1).max(200),
  type: z.enum(['DIRECT_LINE', 'OPINION']),
  targetId: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = resolveClientIp(request.headers);

  // Rate limiting: max 3 req/IP/hour
  const rateLimit = await feedbackRateLimiter.limit(ip);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.reset) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await notion.pages.create({
      parent: { database_id: env.NOTION_NOTES_DB_ID },
      properties: {
        MessageTitle: { title: [{ text: { content: parsed.data.messageTitle } }] },
        MessageBody: { rich_text: [{ text: { content: parsed.data.messageBody } }] },
        AuthorName: { rich_text: [{ text: { content: parsed.data.authorName } }] },
        AuthorContact: { rich_text: [{ text: { content: parsed.data.authorContact } }] },
        Type: { select: { name: parsed.data.type } },
        TargetId: {
          rich_text: parsed.data.targetId
            ? [{ text: { content: parsed.data.targetId } }]
            : [],
        },
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to ingest feedback' },
      { status: 500 }
    );
  }
}
