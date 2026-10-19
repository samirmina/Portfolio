export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '../../../lib/env';
import { createRateLimiter } from '../../../src/lib/redis';
import { resolveClientIp } from '../../../src/lib/ip';
import { notion } from '../../../src/lib/notion';

const endorseRateLimiter = createRateLimiter(10, 3600); // 10 req/IP/hour

const endorseSchema = z.object({
  targetDb: z.enum(['ActivityLogs', 'ProfessionalInsights']),
  targetId: z.string().min(1),
});

const DB_MAP: Record<string, string> = {
  ActivityLogs: env.NOTION_LOGS_DB_ID,
  ProfessionalInsights: env.NOTION_INSIGHTS_DB_ID,
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = resolveClientIp(request.headers);

  // Rate limiting: max 10 req/IP/hour
  const rateLimit = await endorseRateLimiter.limit(ip);
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

  const parsed = endorseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const databaseId = DB_MAP[parsed.data.targetDb];
  if (!databaseId) {
    return NextResponse.json({ error: 'Unknown target database' }, { status: 400 });
  }

  try {
    await notion.pages.update({
      page_id: parsed.data.targetId,
      properties: {
        Approvals: { number: 1 },
      },
    });
    return NextResponse.json({ ok: true, databaseId, targetId: parsed.data.targetId });
  } catch {
    return NextResponse.json(
      { error: 'Failed to record endorsement' },
      { status: 500 }
    );
  }
}
