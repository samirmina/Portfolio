export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { env } from '../../../lib/env';
import { createRateLimiter } from '../../../src/lib/redis';
import { resolveClientIp } from '../../../src/lib/ip';
import { compareSecrets } from '../../../src/lib/compare-secrets';

const revalidateRateLimiter = createRateLimiter(5, 3600); // 5 req/hr

// Vercel Cron sends an unauthenticated GET with the x-vercel-cron: 1 header.
// Manual admin triggers use Authorization: Bearer <REVALIDATE_SECRET>.
function isAuthorized(request: NextRequest): boolean {
  if (request.headers.get('x-vercel-cron') === '1') {
    return true;
  }
  const authHeader = request.headers.get('authorization');
  return (
    !!authHeader &&
    authHeader.startsWith('Bearer ') &&
    compareSecrets(authHeader.slice('Bearer '.length), env.REVALIDATE_SECRET)
  );
}

async function runRevalidation(): Promise<NextResponse> {
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

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Rate limiting: max 5 req/hr per IP
  const ip = resolveClientIp(request.headers);
  const rateLimit = await revalidateRateLimiter.limit(ip);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.reset) } }
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return runRevalidation();
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Rate limiting: max 5 req/hr per IP
  const ip = resolveClientIp(request.headers);
  const rateLimit = await revalidateRateLimiter.limit(ip);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.reset) } }
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return runRevalidation();
}
