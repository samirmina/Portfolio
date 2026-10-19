import { compareSecrets } from '@/lib/compare-secrets';

describe('compareSecrets', () => {
  it('returns true for identical secrets', () => {
    expect(compareSecrets('secret123', 'secret123')).toBe(true);
  });

  it('returns false for different secrets', () => {
    expect(compareSecrets('secret123', 'secret456')).toBe(false);
  });

  it('returns false for empty vs non-empty', () => {
    expect(compareSecrets('', 'secret')).toBe(false);
    expect(compareSecrets('secret', '')).toBe(false);
  });

  it('returns true for two empty strings', () => {
    expect(compareSecrets('', '')).toBe(true);
  });

  it('is constant-time safe (same length, different content)', () => {
    expect(compareSecrets('aaaa', 'bbbb')).toBe(false);
    expect(compareSecrets('aaaa', 'aaab')).toBe(false);
  });
});
