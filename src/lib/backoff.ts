/**
 * Exponential backoff retry wrapper for idempotent requests.
 * Retries only on HTTP 429 (Too Many Requests) responses.
 */
export async function withBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelayMs?: number;
  } = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 5;
  const baseDelayMs = options.baseDelayMs ?? 1000;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const status = (error as { status?: number })?.status;

      if (status !== 429 || attempt === maxRetries) {
        break;
      }

      const jitter = Math.floor(Math.random() * 300);
      const delay = baseDelayMs * 2 ** attempt + jitter;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
