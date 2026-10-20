/**
 * Curated per-repository descriptions.
 *
 * GitHub returns `description: null` for every repo in this account, which the
 * UI renders as "No description provided." These notes supply accurate, specific
 * context for each project, keyed by repository name so they stay in sync with
 * the GitHub listing regardless of what the API returns.
 *
 * To update a description, edit the entry below — no rebuild of upstream data needed.
 */
export const REPO_DESCRIPTIONS: Record<string, string> = {
  Portfolio:
    'Professional ecosystem portfolio website built with Next.js 14 (App + Pages Router), TypeScript, Tailwind CSS, a Notion headless CMS, build-time GitHub enrichment, Upstash rate limiting, and incremental static regeneration.',

  SHETFUEK:
    'Zendesk Assistant — browser extension and tooling for assisting Zendesk-based customer support workflows, with Docker/WSL setup notes and architecture documentation.',

  'BookMind-Nexus':
    'AI PDF extraction platform (Java/Spring Boot) for ingesting document content and querying it with LLM-powered retrieval.',

  Gek:
    'Voice translation desktop application (Python) for real-time spoken-language translation.',

  Linkdroid:
    'Local-only Android screen mirroring using embedded scrcpy. No cloud, no internet required after setup; discovers phones via Tailscale CLI, mDNS, TCP beacon, or USB debugging.',

  CodeSpace:
    'Chronos — Java 21/JavaFX 21 desktop Pomodoro and task manager with a circular timer, task CRUD, priority/status/tags/due dates, reports, session history, and optional PostgreSQL user synchronization.',

  Zendrag:
    'Zenduck — browser extension that monitors new Zendesk tickets and alerts you with configurable sound notifications, via a persistent background service worker.',

  LLL:
    'LLL Verifier — offline translation verification tool (Java/Spring Boot/JavaFX).',

  CodeInsight_Analyzer:
    'Code analysis platform (Kotlin/Ktor) for static code inspection and reporting.',
};

/** Resolve a description for a repo, preferring the curated note. */
export function describeRepo(repoName: string, githubDescription: string | null): string {
  if (githubDescription && githubDescription.trim().length > 0) {
    return githubDescription;
  }
  return REPO_DESCRIPTIONS[repoName] ?? '';
}