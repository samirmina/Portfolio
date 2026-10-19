import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Factory for independent sliding-window rate-limit buckets per endpoint.
 * Identifiers are resolved to IPs by the API route handlers (see Phase 4).
 */
export function createRateLimiter(maxRequests: number, windowSeconds: number) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
  });
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};
