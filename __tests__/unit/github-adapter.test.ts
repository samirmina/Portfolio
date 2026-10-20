import { enrichRepository, fetchUserRepositories } from '@/lib/adapters/github';

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('@/lib/notion', () => ({
  notion: {
    databases: { query: jest.fn() },
    pages: { retrieve: jest.fn() },
    blocks: { children: { list: jest.fn() } },
  },
}));

jest.mock('@/lib/backoff', () => ({
  withBackoff: jest.fn(async (fn: () => Promise<unknown>) => fn()),
}));

describe('enrichRepository', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('enriches with GitHub data when available', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          description: 'A repo',
          stargazers_count: 42,
          language: 'TypeScript',
          pushed_at: '2026-01-01',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => null },
        json: async () => [],
      });

    const result = await enrichRepository({
      repoName: 'my-repo',
      url: 'https://github.com/user/my-repo',
    });

    expect(result.description).toBe('A repo');
    expect(result.stargazersCount).toBe(42);
    expect(result.language).toBe('TypeScript');
  });

  it('handles missing GitHub data gracefully', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const result = await enrichRepository({
      repoName: 'nonexistent',
      url: 'https://github.com/user/nonexistent',
    });

    expect(result.description).toBeNull();
    expect(result.stargazersCount).toBe(0);
  });
});

describe('fetchUserRepositories', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('fetches user repositories', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            name: 'repo-1',
            full_name: 'user/repo-1',
            html_url: 'https://github.com/user/repo-1',
            description: 'First repo',
            stargazers_count: 10,
            language: 'TypeScript',
            pushed_at: '2026-01-01',
          },
        ],
      })
      // Commit stats for repo-1 (page 1, empty list ends pagination)
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => null },
        json: async () => [],
      })
      // Pagination page 2 (empty, ends listing loop)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    const repos = await fetchUserRepositories();
    expect(repos).toHaveLength(1);
    expect(repos[0].name).toBe('repo-1');
    expect(repos[0].fullName).toBe('user/repo-1');
    expect(repos[0].stargazersCount).toBe(10);
  });

  it('returns empty array on API failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const repos = await fetchUserRepositories();
    expect(repos).toEqual([]);
  });
});
