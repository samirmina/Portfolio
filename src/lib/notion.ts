import { Client } from '@notionhq/client';

if (!process.env.NOTION_TOKEN) {
  throw new Error('NOTION_TOKEN is required to initialize the Notion client');
}

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

/**
 * Exhaustive pagination over any Notion list-style API endpoint.
 * Uses manual cursor iteration (while has_more) so it works across all
 * Notion endpoints, including those not covered by client.paginate().
 */
export async function paginateNotion<T>(
  fetchPage: (startCursor?: string) => Promise<{
    results: T[];
    has_more: boolean;
    next_cursor?: string | null | undefined;
  }>
): Promise<T[]> {
  const all: T[] = [];
  let startCursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchPage(startCursor);
    all.push(...response.results);
    hasMore = response.has_more;
    startCursor = response.next_cursor ?? undefined;
  }

  return all;
}
