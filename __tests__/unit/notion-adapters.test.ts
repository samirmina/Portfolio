import { fetchActivityLogs, fetchRepositories } from '@/lib/adapters/notion';
import { notion, paginateNotion } from '@/lib/notion';

jest.mock('@/lib/notion', () => ({
  notion: {
    databases: {
      query: jest.fn(),
    },
  },
  paginateNotion: jest.fn(),
}));

const mockQuery = notion.databases.query as jest.Mock;
const mockPaginate = paginateNotion as jest.Mock;

const mockPage = (overrides: Record<string, unknown> = {}) => ({
  id: 'page-id',
  properties: {
    Title: { title: [{ plain_text: 'Test' }] },
    Published: { checkbox: true },
    ...overrides,
  },
});

describe('fetchActivityLogs', () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockPaginate.mockReset();
  });

  it('returns mapped records from Notion', async () => {
    mockPaginate.mockResolvedValue([
      mockPage({ Summary: { rich_text: [{ plain_text: 'summary' }] } }),
    ]);
    const logs = await fetchActivityLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].title).toBe('Test');
    expect(logs[0].summary).toBe('summary');
    expect(logs[0].published).toBe(true);
  });

  it('filters out unpublished records', async () => {
    mockPaginate.mockResolvedValue([
      mockPage({ Published: { checkbox: true } }),
      { id: 'unpub', properties: { Published: { checkbox: false } } },
    ]);
    const logs = await fetchActivityLogs();
    expect(logs).toHaveLength(1);
  });

  it('falls back to empty array on error', async () => {
    mockPaginate.mockRejectedValue(new Error('Notion down'));
    const logs = await fetchActivityLogs();
    expect(logs).toEqual([]);
  });
});

describe('fetchRepositories', () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockPaginate.mockReset();
  });

  it('returns mapped repository records', async () => {
    mockPaginate.mockResolvedValue([
      mockPage({
        RepoName: { rich_text: [{ plain_text: 'my-repo' }] },
        Description: { rich_text: [{ plain_text: 'A repo' }] },
        Url: { url: 'https://github.com/user/my-repo' },
        Stargazers: { number: 10 },
        CommitCount: { number: 5 },
        LastCommitAt: { date: { start: '2026-01-01' } },
        Language: { select: { name: 'TypeScript' } },
      }),
    ]);
    const repos = await fetchRepositories();
    expect(repos).toHaveLength(1);
    expect(repos[0].repoName).toBe('my-repo');
    expect(repos[0].language).toBe('TypeScript');
  });
});
