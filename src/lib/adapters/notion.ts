import { notion, paginateNotion } from '../notion';
import { withBackoff } from '../backoff';
import {
  ActivityLog,
  ProfessionalInsight,
  Repository,
  DirectLineNote,
  extractTitle,
  extractRichText,
  extractMultiSelect,
  extractUrl,
  extractNumber,
  extractDate,
  extractCheckbox,
  extractSelect,
} from '../normalizers';
import { env } from '../../../lib/env';

type NotionPage = Record<string, unknown>;

/**
 * Exhaustively query a Notion database, applying Published filtering and 429
 * backoff. Falls back to seed data when the upstream API is unavailable.
 */
async function queryDatabaseExhaustive<T extends { id: string }>(
  databaseId: string,
  mapPage: (page: NotionPage) => T | null,
  fallback: T[],
  options: { filterPublished?: boolean } = {}
): Promise<T[]> {
  const filterPublished = options.filterPublished ?? true;

  const fetchPage = async (
    startCursor?: string
  ): Promise<{
    results: NotionPage[];
    has_more: boolean;
    next_cursor?: string | null | undefined;
  }> => {
    const queryParams: Parameters<typeof notion.databases.query>[0] = {
      database_id: databaseId,
      start_cursor: startCursor,
      page_size: 100,
    };

    if (filterPublished) {
      queryParams.filter = {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      };
    }

    const response = await withBackoff(() =>
      notion.databases.query(queryParams)
    );
    return {
      results: response.results as unknown as NotionPage[],
      has_more: response.has_more,
      next_cursor: response.next_cursor ?? undefined,
    };
  };

  const pages = await paginateNotion(fetchPage);

  const records: T[] = [];
  for (const page of pages) {
    const mapped = mapPage(page);
    if (mapped) {
      records.push(mapped);
    }
  }

  return records;
}

/** Map a raw Notion page to an ActivityLog. */
function mapActivityLog(page: NotionPage): ActivityLog | null {
  const properties = page.properties as Record<string, unknown>;
  const published = extractCheckbox(
    properties.Published as { checkbox?: boolean } | null
  );
  if (!published) {
    return null;
  }
  return {
    id: page.id as string,
    title: extractTitle(
      properties.Title as { title?: { plain_text: string }[] } | null
    ),
    summary: extractRichText(
      properties.Summary as { rich_text?: { plain_text: string }[] } | null
    ),
    tags: extractMultiSelect(
      properties.Tags as { multi_select?: { name: string }[] } | null
    ),
    videoUrl: extractUrl(
      properties.VideoUrl as { url?: string | null } | null
    ),
    approvals: extractNumber(
      properties.Approvals as { number?: number | null } | null
    ),
    date: extractDate(
      properties.Date as { date?: { start?: string | null } | null } | null
    ),
    published,
  };
}

/** Map a raw Notion page to a ProfessionalInsight. */
function mapProfessionalInsight(page: NotionPage): ProfessionalInsight | null {
  const properties = page.properties as Record<string, unknown>;
  const published = extractCheckbox(
    properties.Published as { checkbox?: boolean } | null
  );
  if (!published) {
    return null;
  }
  return {
    id: page.id as string,
    title: extractTitle(
      properties.Title as { title?: { plain_text: string }[] } | null
    ),
    context: extractRichText(
      properties.Context as { rich_text?: { plain_text: string }[] } | null
    ),
    challenges: extractRichText(
      properties.Challenges as { rich_text?: { plain_text: string }[] } | null
    )
      .split('\n')
      .filter(Boolean),
    tradeOffs: extractRichText(
      properties.TradeOffs as { rich_text?: { plain_text: string }[] } | null
    )
      .split('\n')
      .filter(Boolean),
    tags: extractMultiSelect(
      properties.Tags as { multi_select?: { name: string }[] } | null
    ),
    videoUrl: extractUrl(
      properties.VideoUrl as { url?: string | null } | null
    ),
    approvals: extractNumber(
      properties.Approvals as { number?: number | null } | null
    ),
    date: extractDate(
      properties.Date as { date?: { start?: string | null } | null } | null
    ),
    published,
  };
}

/** Map a raw Notion page to a Repository. */
function mapRepository(page: NotionPage): Repository | null {
  const properties = page.properties as Record<string, unknown>;
  const published = extractCheckbox(
    properties.Published as { checkbox?: boolean } | null
  );
  if (!published) {
    return null;
  }
  return {
    id: page.id as string,
    title: extractTitle(
      properties.Title as { title?: { plain_text: string }[] } | null
    ),
    repoName: extractRichText(
      properties.RepoName as { rich_text?: { plain_text: string }[] } | null
    ),
    description: extractRichText(
      properties.Description as { rich_text?: { plain_text: string }[] } | null
    ),
    url:
      extractUrl(properties.Url as { url?: string | null } | null) ?? '',
    stargazers: extractNumber(
      properties.Stargazers as { number?: number | null } | null
    ),
    commitCount: extractNumber(
      properties.CommitCount as { number?: number | null } | null
    ),
    lastCommitAt: extractDate(
      properties.LastCommitAt as {
        date?: { start?: string | null } | null;
      } | null
    ),
    language: extractSelect(
      properties.Language as { select?: { name: string } | null } | null
    ),
    published,
  };
}

/** Map a raw Notion page to a DirectLineNote. */
function mapDirectLineNote(page: NotionPage): DirectLineNote | null {
  const properties = page.properties as Record<string, unknown>;
  const type = extractSelect(
    properties.Type as { select?: { name: string } | null } | null
  );
  if (type !== 'DIRECT_LINE' && type !== 'OPINION') {
    return null;
  }
  return {
    id: page.id as string,
    messageTitle: extractRichText(
      properties.MessageTitle as { rich_text?: { plain_text: string }[] } | null
    ),
    messageBody: extractRichText(
      properties.MessageBody as { rich_text?: { plain_text: string }[] } | null
    ),
    authorName: extractRichText(
      properties.AuthorName as { rich_text?: { plain_text: string }[] } | null
    ),
    authorContact: extractRichText(
      properties.AuthorContact as { rich_text?: { plain_text: string }[] } | null
    ),
    type,
    targetId:
      extractRichText(
        properties.TargetId as { rich_text?: { plain_text: string }[] } | null
      ) || null,
  };
}

export async function fetchActivityLogs(): Promise<ActivityLog[]> {
  try {
    return await queryDatabaseExhaustive(
      env.NOTION_LOGS_DB_ID,
      mapActivityLog,
      []
    );
  } catch (error) {
    console.warn('Notion Activity Logs fetch failed:', error);
    return [];
  }
}

export async function fetchProfessionalInsights(): Promise<ProfessionalInsight[]> {
  try {
    return await queryDatabaseExhaustive(
      env.NOTION_INSIGHTS_DB_ID,
      mapProfessionalInsight,
      []
    );
  } catch (error) {
    console.warn('Notion Professional Insights fetch failed:', error);
    return [];
  }
}

export async function fetchRepositories(): Promise<Repository[]> {
  try {
    return await queryDatabaseExhaustive(
      env.NOTION_REPOS_DB_ID,
      mapRepository,
      []
    );
  } catch (error) {
    console.warn('Notion Repositories fetch failed:', error);
    return [];
  }
}

export async function fetchDirectLineNotes(): Promise<DirectLineNote[]> {
  try {
    return await queryDatabaseExhaustive(
      env.NOTION_NOTES_DB_ID,
      mapDirectLineNote,
      [],
      { filterPublished: false }
    );
  } catch (error) {
    console.warn('Notion Direct Line fetch failed:', error);
    return [];
  }
}

/**
 * Two-step recursive block retrieval.
 * Step 1: fetch the page. Step 2: recursively collect all child blocks.
 */
export async function fetchPageWithBlocks(pageId: string): Promise<{
  page: NotionPage;
  blocks: NotionPage[];
}> {
  const page = await withBackoff(() => notion.pages.retrieve({ page_id: pageId }));

  const blocks: NotionPage[] = [];

  const collectBlocks = async (
    blockId: string,
    startCursor?: string
  ): Promise<void> => {
    const response = await withBackoff(() =>
      notion.blocks.children.list({
        block_id: blockId,
        start_cursor: startCursor,
        page_size: 100,
      })
    );
    for (const block of response.results as unknown as NotionPage[]) {
      blocks.push(block);
      if (block.has_children) {
        await collectBlocks(block.id as string);
      }
    }
    if (response.has_more && response.next_cursor) {
      await collectBlocks(blockId, response.next_cursor);
    }
  };

  await collectBlocks(pageId);

  return { page: page as unknown as NotionPage, blocks };
}

/** Fetch a single page; throws if not found (used by route notFound() handling). */
export async function getPageOrThrow(pageId: string): Promise<NotionPage> {
  const page = await withBackoff(() => notion.pages.retrieve({ page_id: pageId }));
  return page as unknown as NotionPage;
}
