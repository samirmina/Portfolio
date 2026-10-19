import { createRateLimiter } from '@/lib/redis';

describe('createRateLimiter', () => {
  it('creates a rate limiter with the specified config', () => {
    const limiter = createRateLimiter(5, 3600);
    expect(limiter).toBeDefined();
    expect(typeof limiter.limit).toBe('function');
  });
});
