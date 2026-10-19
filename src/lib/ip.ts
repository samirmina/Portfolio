/**
 * Resolve the client IP from Vercel/CDN headers in priority order:
 * x-vercel-forwarded-for → x-real-ip → x-forwarded-for, with 127.0.0.1 fallback.
 */
export function resolveClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-vercel-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first && isValidIp(first)) {
      return first;
    }
  }

  const realIp = headers.get('x-real-ip');
  if (realIp && isValidIp(realIp.trim())) {
    return realIp.trim();
  }

  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const first = xForwardedFor.split(',')[0]?.trim();
    if (first && isValidIp(first)) {
      return first;
    }
  }

  return '127.0.0.1';
}

function isValidIp(ip: string): boolean {
  // IPv4 dotted-quad or IPv6 colon-separated
  const ipv4Re = /^\d{1,3}(\.\d{1,3}){3}$/;
  const ipv6Re = /^[0-9a-fA-F:]+:[0-9a-fA-F:]+$/;
  return ipv4Re.test(ip) || ipv6Re.test(ip);
}
