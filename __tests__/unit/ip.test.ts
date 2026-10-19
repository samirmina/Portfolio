import { resolveClientIp } from '@/lib/ip';

describe('resolveClientIp', () => {
  const headers = (record: Record<string, string | null>) =>
    new Headers(record as Record<string, string>);

  it('prefers x-vercel-forwarded-for', () => {
    const h = headers({
      'x-vercel-forwarded-for': '1.2.3.4, 5.6.7.8',
      'x-real-ip': '9.9.9.9',
    });
    expect(resolveClientIp(h)).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip', () => {
    const h = headers({
      'x-vercel-forwarded-for': null,
      'x-real-ip': '9.9.9.9',
      'x-forwarded-for': '1.1.1.1',
    });
    expect(resolveClientIp(h)).toBe('9.9.9.9');
  });

  it('falls back to first x-forwarded-for', () => {
    const h = headers({
      'x-vercel-forwarded-for': null,
      'x-real-ip': null,
      'x-forwarded-for': '1.1.1.1, 2.2.2.2',
    });
    expect(resolveClientIp(h)).toBe('1.1.1.1');
  });

  it('falls back to 127.0.0.1 when no valid IP', () => {
    const h = headers({});
    expect(resolveClientIp(h)).toBe('127.0.0.1');
  });

  it('handles IPv6 addresses', () => {
    const h = headers({
      'x-real-ip': '2001:db8::1',
    });
    expect(resolveClientIp(h)).toBe('2001:db8::1');
  });
});
