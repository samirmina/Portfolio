export type NotionRichTextArray = {
  plain_text: string;
  href: string | null;
}[];

export type NotionTitleArray = {
  plain_text: string;
}[];

export type NotionDate = {
  start: string | null;
  end: string | null;
  time_zone: string | null;
} | null;

export interface ActivityLog {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  videoUrl: string | null;
  approvals: number;
  date: string | null;
  published: boolean;
}

export interface ProfessionalInsight {
  id: string;
  title: string;
  context: string;
  challenges: string[];
  tradeOffs: string[];
  tags: string[];
  videoUrl: string | null;
  approvals: number;
  date: string | null;
  published: boolean;
}

export interface Repository {
  id: string;
  title: string;
  repoName: string;
  description: string;
  url: string;
  stargazers: number;
  commitCount: number;
  lastCommitAt: string | null;
  language: string | null;
  published: boolean;
}

export interface DirectLineNote {
  id: string;
  messageTitle: string;
  messageBody: string;
  authorName: string;
  authorContact: string;
  type: 'DIRECT_LINE' | 'OPINION';
  targetId: string | null;
}

export interface GitHubRepository {
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stargazersCount: number;
  language: string | null;
  updatedAt: string | null;
  commitCount: number;
  lastCommitAt: string | null;
}

/** Keep only records whose Notion Published checkbox is true. */
export function filterPublished<T extends { published: boolean }>(
  records: T[]
): T[] {
  return records.filter((record) => record.published === true);
}

/** Extract plain text from a Notion title property. */
export function extractTitle(
  prop?: { title?: { plain_text: string }[] } | null
): string {
  return prop?.title?.map((t) => t.plain_text).join('') ?? '';
}

/** Extract plain text from a Notion rich_text property. */
export function extractRichText(
  prop?: { rich_text?: { plain_text: string }[] } | null
): string {
  return prop?.rich_text?.map((t) => t.plain_text).join('') ?? '';
}

/** Extract names from a Notion multi_select property. */
export function extractMultiSelect(
  prop?: { multi_select?: { name: string }[] } | null
): string[] {
  return prop?.multi_select?.map((o) => o.name) ?? [];
}

/** Extract a URL from a Notion url property. */
export function extractUrl(prop?: { url?: string | null } | null): string | null {
  return prop?.url ?? null;
}

/** Extract a number from a Notion number property. */
export function extractNumber(prop?: { number?: number | null } | null): number {
  return prop?.number ?? 0;
}

/** Extract the start date from a Notion date property. */
export function extractDate(
  prop?: { date?: { start?: string | null } | null } | null
): string | null {
  return prop?.date?.start ?? null;
}

/** Extract the checkbox boolean from a Notion checkbox property. */
export function extractCheckbox(prop?: { checkbox?: boolean } | null): boolean {
  return prop?.checkbox ?? false;
}

/** Extract the name from a Notion select property. */
export function extractSelect(
  prop?: { select?: { name: string } | null } | null
): string | null {
  return prop?.select?.name ?? null;
}
