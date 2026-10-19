export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { env } from '../../../lib/env';
import { createRateLimiter } from '../../../src/lib/redis';
import { resolveClientIp } from '../../../src/lib/ip';
import { compareSecrets } from '../../../src/lib/compare-secrets';

const revalidateRateLimiter = createRateLimiter(5, 3600); // 5 req/hr

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = resolveClientIp(request.headers);

  // Rate limiting: max 5 req/hr per IP
  const rateLimit = await revalidateRateLimiter.limit(ip);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.reset) } }
    );
  }

  // Vercel Cron sends unauthenticated GET with x-vercel-cron: 1 header.
  // Manual admin triggers use Authorization: Bearer <REVALIDATE_SECRET>.
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const authHeader = request.headers.get('authorization');
  const isAuthorized =
    isVercelCron ||
    (authHeader &&
      authHeader.startsWith('Bearer ') &&
      compareSecrets(
        authHeader.slice('Bearer '.length),
        env.REVALIDATE_SECRET
      ));

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    revalidateTag('notion-cms');
    revalidateTag('github-data');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}
