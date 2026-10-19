import { withBackoff } from '@/lib/backoff';

describe('withBackoff', () => {
  it('returns result on first success without retry', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const result = await withBackoff(fn);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on HTTP 429 and eventually succeeds', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error('429'), { status: 429 }))
      .mockRejectedValueOnce(Object.assign(new Error('429'), { status: 429 }))
      .mockResolvedValue('ok');
    const result = await withBackoff(fn, { maxRetries: 5, baseDelayMs: 1 });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('throws when max retries exhausted on 429', async () => {
    const err = Object.assign(new Error('429'), { status: 429 });
    const fn = jest.fn().mockRejectedValue(err);
    await expect(
      withBackoff(fn, { maxRetries: 2, baseDelayMs: 1 })
    ).rejects.toBe(err);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('does not retry on non-429 errors', async () => {
    const err = new Error('server error');
    (err as any).status = 500;
    const fn = jest.fn().mockRejectedValue(err);
    await expect(withBackoff(fn)).rejects.toBe(err);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
