import { createHash, timingSafeEqual } from 'crypto';

/**
 * Constant-time comparison of two secrets after SHA-256 hashing both sides,
 * per the blueprint's defense-in-depth requirement.
 */
export function compareSecrets(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  if (hashA.length !== hashB.length) {
    return false;
  }
  return timingSafeEqual(hashA, hashB);
}
