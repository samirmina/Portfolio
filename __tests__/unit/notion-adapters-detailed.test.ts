import {
  fetchActivityLogs,
  fetchProfessionalInsights,
  fetchRepositories,
  fetchDirectLineNotes,
  fetchPageWithBlocks,
  getPageOrThrow,
} from '@/lib/adapters/notion';
import { notion, paginateNotion } from '@/lib/notion';
import { withBackoff } from '@/lib/backoff';

jest.mock('@/lib/notion', () => ({
  notion: {
    databases: { query: jest.fn() },
    pages: { retrieve: jest.fn() },
    blocks: { children: { list: jest.fn() } },
  },
  paginateNotion: jest.fn(),
}));

jest.mock('@/lib/backoff', () => ({
  withBackoff: jest.fn(async (fn: () => Promise<unknown>) => fn()),
}));

const mockQuery = notion.databases.query as jest.Mock;
const mockPaginate = paginateNotion as jest.Mock;
const mockRetrieve = notion.pages.retrieve as jest.Mock;
const mockList = notion.blocks.children.list as jest.Mock;
const mockWithBackoff = withBackoff as jest.Mock;

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
  });

  it('filters out unpublished records', async () => {
    mockPaginate.mockResolvedValue([
      mockPage({ Published: { checkbox: true } }),
      { id: 'unpub', properties: { Published: { checkbox: false } } },
    ]);
    const logs = await fetchActivityLogs();
    expect(logs).toHaveLength(1);
  });

  it('falls back to seed data on error', async () => {
    mockPaginate.mockRejectedValue(new Error('Notion down'));
    const logs = await fetchActivityLogs();
    expect(logs.length).toBeGreaterThan(0);
  });
});

describe('fetchProfessionalInsights', () => {
  beforeEach(() => {
    mockPaginate.mockReset();
  });

  it('returns mapped records from Notion', async () => {
    mockPaginate.mockResolvedValue([
      mockPage({
        Context: { rich_text: [{ plain_text: 'context' }] },
        Challenges: { rich_text: [{ plain_text: 'challenge' }] },
        TradeOffs: { rich_text: [{ plain_text: 'tradeoff' }] },
      }),
    ]);
    const insights = await fetchProfessionalInsights();
    expect(insights).toHaveLength(1);
    expect(insights[0].title).toBe('Test');
    expect(insights[0].context).toBe('context');
    expect(insights[0].challenges).toEqual(['challenge']);
    expect(insights[0].tradeOffs).toEqual(['tradeoff']);
  });
});

describe('fetchRepositories', () => {
  beforeEach(() => {
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
    expect(repos[0].stargazers).toBe(10);
    expect(repos[0].language).toBe('TypeScript');
  });
});

describe('fetchDirectLineNotes', () => {
  beforeEach(() => {
    mockPaginate.mockReset();
  });

  it('returns mapped direct line notes', async () => {
    mockPaginate.mockResolvedValue([
      mockPage({
        Type: { select: { name: 'DIRECT_LINE' } },
        MessageTitle: { rich_text: [{ plain_text: 'Hello' }] },
        MessageBody: { rich_text: [{ plain_text: 'Body' }] },
        AuthorName: { rich_text: [{ plain_text: 'Jane' }] },
        AuthorContact: { rich_text: [{ plain_text: 'jane@example.com' }] },
        TargetId: { rich_text: [] },
      }),
    ]);
    const notes = await fetchDirectLineNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0].type).toBe('DIRECT_LINE');
    expect(notes[0].messageTitle).toBe('Hello');
  });

  it('filters out notes with invalid type', async () => {
    mockPaginate.mockResolvedValue([
      mockPage({ Type: { select: { name: 'INVALID' } } }),
      mockPage({ Type: { select: { name: 'OPINION' } } }),
    ]);
    const notes = await fetchDirectLineNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0].type).toBe('OPINION');
  });
});

describe('fetchPageWithBlocks', () => {
  beforeEach(() => {
    mockRetrieve.mockReset();
    mockList.mockReset();
    mockWithBackoff.mockReset();
  });

  it('fetches page and recursively collects blocks', async () => {
    mockRetrieve.mockResolvedValue({ id: 'page-id', properties: {} });
    mockList
      .mockResolvedValueOnce({
        results: [{ id: 'block-1', has_children: true }],
        has_more: false,
      })
      .mockResolvedValueOnce({
        results: [{ id: 'block-2', has_children: false }],
        has_more: false,
      });

    mockWithBackoff.mockImplementation(async (fn: () => Promise<unknown>) => {
      return fn();
    });

    const result = await fetchPageWithBlocks('page-id');
    expect(result.page.id).toBe('page-id');
    expect(result.blocks).toHaveLength(2);
    expect(mockList).toHaveBeenCalledTimes(2);
  });
});

describe('getPageOrThrow', () => {
  beforeEach(() => {
    mockRetrieve.mockReset();
    mockWithBackoff.mockReset();
  });

  it('retrieves a single page', async () => {
    mockRetrieve.mockResolvedValue({ id: 'page-id' });
    mockWithBackoff.mockImplementation(async (fn: () => Promise<unknown>) => {
      return fn();
    });

    const page = await getPageOrThrow('page-id');
    expect(page.id).toBe('page-id');
  });
});
