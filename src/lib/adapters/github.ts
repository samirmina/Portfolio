import { withBackoff } from '../backoff';
import { env } from '../../../lib/env';
import { GitHubRepository } from '../normalizers';

const GITHUB_API = 'https://api.github.com';

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-github-enrichment',
  };
  if (env.GITHUB_TOKEN) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function githubFetch(path: string): Promise<Response> {
  return withBackoff(() => fetch(`${GITHUB_API}${path}`, { headers: githubHeaders() }));
}

/** Parse the Link header to find the last page number for commit counting. */
function parseLastPage(linkHeader: string | null): number {
  if (!linkHeader) {
    return 1;
  }
  const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Fetch commit count and last commit date for a repository.
 * Paginates commits (capped) to count them; falls back to repo pushed_at.
 */
async function fetchCommitStats(
  owner: string,
  repo: string
): Promise<{ commitCount: number; lastCommitAt: string | null }> {
  let commitCount = 0;
  let lastCommitAt: string | null = null;
  let page = 1;
  const maxPages = 10; // cap to avoid runaway on large repos

  while (page <= maxPages) {
    const response = await githubFetch(`/repos/${owner}/${repo}/commits?per_page=100&page=${page}`);
    if (!response.ok) {
      break;
    }
    const commits = (await response.json()) as Array<{ commit: { author: { date: string } } }>;
    if (commits.length === 0) {
      break;
    }
    if (page === 1 && commits[0]) {
      lastCommitAt = commits[0].commit.author.date;
    }
    commitCount += commits.length;

    const link = response.headers.get('link');
    const lastPage = parseLastPage(link);
    if (page >= lastPage) {
      break;
    }
    page++;
  }

  return { commitCount, lastCommitAt };
}

/**
 * Enrich a Notion repository record with build-time GitHub data.
 * Falls back to unauthenticated public endpoints when GITHUB_TOKEN is absent.
 */
interface GitHubRepoResponse {
  description: string | null;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
}

export async function enrichRepository(
  repo: { repoName: string; url: string }
): Promise<Partial<GitHubRepository>> {
  const username = env.GITHUB_USERNAME;
  const repoName = repo.repoName;

  let repoData: GitHubRepoResponse | null = null;
  try {
    const response = await githubFetch(`/repos/${username}/${repoName}`);
    if (response.ok) {
      repoData = (await response.json()) as GitHubRepoResponse;
    }
  } catch (error) {
    console.warn(`GitHub enrichment failed for ${repoName}:`, error);
  }

  const enriched: Partial<GitHubRepository> = {
    name: repoName,
    fullName: `${username}/${repoName}`,
    htmlUrl: repo.url,
    description: repoData?.description ?? null,
    stargazersCount: repoData?.stargazers_count ?? 0,
    language: repoData?.language ?? null,
    updatedAt: repoData?.pushed_at ?? null,
  };

  if (repoData) {
    const commits = await fetchCommitStats(username, repoName);
    enriched.commitCount = commits.commitCount;
    enriched.lastCommitAt = commits.lastCommitAt ?? repoData.pushed_at ?? null;
  }

  return enriched;
}

/**
 * Fetch all public repositories for the configured GitHub username.
 * Used at build time to seed the repository index when Notion is unavailable.
 */
export async function fetchUserRepositories(): Promise<GitHubRepository[]> {
  const username = env.GITHUB_USERNAME;
  const repositories: GitHubRepository[] = [];
  let page = 1;

  while (true) {
    const response = await githubFetch(`/users/${username}/repos?per_page=100&sort=updated&page=${page}`);
    if (!response.ok) {
      break;
    }
    const repos = (await response.json()) as Array<{
      name: string;
      full_name: string;
      html_url: string;
      description: string | null;
      stargazers_count: number;
      language: string | null;
      pushed_at: string;
    }>;
    if (repos.length === 0) {
      break;
    }
    for (const r of repos) {
      repositories.push({
        name: r.name,
        fullName: r.full_name,
        htmlUrl: r.html_url,
        description: r.description,
        stargazersCount: r.stargazers_count,
        language: r.language,
        updatedAt: r.pushed_at,
        commitCount: 0,
        lastCommitAt: null,
      });
    }
    page++;
  }

  return repositories;
}
