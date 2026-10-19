# DEFINITIVE ABSOLUTE CANONICAL SPECIFICATION & AGENTIC GOVERNANCE BLUEPRINT (V34)
## Professional Ecosystem Portfolio Website: The Single Source of Truth (Absolute Final Zero-Gap Edition)

> **GOVERNANCE DIRECTIVE FOR AUTONOMOUS AGENTS:**
> This document (V34) serves as the absolute, single, authoritative, and canonical source of truth for the system architecture. It explicitly overrides, supersedes, and deprecates all previous blueprint drafts, iterations, and specifications (V1 through V33). Agents must strictly evaluate and execute system scaffolding solely against V34 specifications without cross-referencing legacy drafts.

---

## 1. COMPREHENSIVE EXECUTIVE SUMMARY & SYSTEM VISION
### 1.1 Core Purpose and Non-Performative Philosophy
The Professional Ecosystem portfolio application is engineered as an uncompromising, production-grade, verifiable alternative to traditional, static PDF resumes and superficial social media professional networks. 
- **Rejection/Vanity Metrics:** The platform explicitly forbids follower counts, self-congratulatory badge counters, flashy non-functional animations, and generic template tropes. 
- **Structural Integrity:** Every visual element, layout grid, and interactive component must serve a distinct, verifiable informative or architectural purpose, prioritizing information density, high-contrast readability, and immediate developer-centric utility.

### 1.2 Operational Governance & Free-Tier Mandate
To ensure sustainable, multi-year professional deployment with zero ongoing financial overhead, the entire ecosystem must operate strictly within robust developer free tiers:
- **Hosting & Edge Delivery:** Vercel Hobby Tier, leveraging global CDN caching, automatic SSL provisioning, and zero-configuration serverless execution.
- **Content Management System:** Notion Free Tier, utilizing dedicated structured databases as a headless CMS.
- **Version Control & Repository Indexing:** GitHub Public API, leveraging repository metadata, commit frequencies, and topic-based discovery.
- **Rate Limiting & Security Middleware:** Upstash Redis Free Tier, providing lightning-fast global Redis instances for sliding-window rate limiting.

---

## 2. ADVANCED ARCHITECTURAL TOPOLOGY & DATA PIPELINES
### 2.1 Hybrid Rendering, Seed Cache & Correct Cache-Tag Structure
The application avoids client-side data fetching bottlenecks and synchronous external API queries by deploying a hybrid rendering model combining Static Site Generation (SSG) with Incremental Static Regeneration (ISR):
- **Correct Cache-Tag Structure:** Data fetches with tag-based revalidation must place `tags` at the top-level option alongside `next`, strictly complying with Next.js App Router rules:
  ```typescript
  fetch(url, { next: { revalidate: 3600 }, tags: ['notion-cms', 'github-data'] })
  ```
- **Build-Time Resilience & Graceful Degradation:** To satisfy zero-downtime mandates during clean Vercel builds (`npm run build`), upstream API failures fall back to repository seed JSON artifacts (`data/seed-fallback.json`) or log structural warnings while producing valid partial builds.

### 2.2 Vercel Cron Invalidation Pipeline & Infrastructure Header Verification
- **Vercel Cron Execution (`vercel.json`):** A single Vercel Cron Job configured inside `vercel.json` pings `/api/revalidate` daily (`0 0 * * *`). 
- **Header Authentication & Revalidation:** Because Vercel Cron executes unauthenticated HTTP GET requests without custom Authorization headers, `/api/revalidate` (`export const runtime = 'nodejs'`) verifies inbound requests using Vercel's infrastructure header (`x-vercel-cron: 1`) alongside an Upstash rate limiter (max 5 req/hr). For manual administrative triggers, optional `Authorization: Bearer <REVALIDATE_SECRET>` authentication is supported via safe cryptographic comparisons (hashing both sides with SHA-256 via `crypto.createHash('sha256')` prior to calling `crypto.timingSafeEqual`).
- **Tag Cache Flushing:** Successful requests execute both `revalidateTag('notion-cms')` and `revalidateTag('github-data')`.

### 2.3 Notion Exhaustive Pagination & Runtime Boundaries
- **Exhaustive Iteration via Pagination:** Notion database queries must not assume single-page responses. Adapters must implement exhaustive pagination loops using Notion's built-in helper (`client.paginate()`) or manual `while (has_more)` cursor iterations to prevent truncated data sets.
- **Static Param Generation (`generateStaticParams`):** Dynamic routes implement `generateStaticParams` querying published Notion records at build time. New dynamic routes published post-build are rendered on-demand via ISR upon first visit.
- **Runtime 404 Access (`notFound()`):** If a user requests a record that was deleted, archived, or unpublished post-build, runtime segment access invokes `notFound()` from `next/navigation`.
- **429 Backoff:** Database queries implement exponential backoff retry wrappers for HTTP 429 response codes.

### 2.4 GitHub Repository Listing, Static Commit Aggregation & Rate-Limit Governance
- **Notion as Primary Source of Truth with GitHub Enrichment:** Notion serves as the canonical headless CMS database (`NOTION_REPOS_DB_ID`). GitHub Search API (`q=user:<username>+topic:showcase`) and commit endpoints are queried at build time to enrich repository listings with commit counts and timestamps.
- **Environment Scope:** `GITHUB_USERNAME` and `NOTION_TOKEN` are strictly server-side variables.
- **Unauthenticated Fallback & Rate Limiting:** If `GITHUB_TOKEN` is omitted, the adapter falls back to unauthenticated public REST endpoints, respecting rate limits and triggering fallback UI cards on failure.

---

## 3. OUTBOUND INTERACTION PIPELINES & SECURITY GOVERNANCE
### 3.1 Separated Outbound API Endpoints & Explicit Database Mappings
- **`POST /api/feedback`:** Direct Line secure communications ingestion into Notion. Requests strictly target `NOTION_NOTES_DB_ID` (write-only ingestion sink, supporting optional `TargetId` context reference and distinguishing message types: `DIRECT_LINE` and `OPINION`). Protected by Upstash rate limiting (3 req/hr) and input validation via Zod.
- **`POST /api/endorse`:** Technical content approvals and endorsements. Request payloads must supply `targetDb` (`'ActivityLogs'` or `'ProfessionalInsights'`) and `targetId` (Notion page ID). Mapped explicitly to:
  - `'ActivityLogs'` -> `NOTION_LOGS_DB_ID`
  - `'ProfessionalInsights'` -> `NOTION_INSIGHTS_DB_ID`
- **Defense in Depth (CSP Headers):** Strict Content Security Policy headers (`Content-Security-Policy`) injected globally via Next.js headers configuration in `next.config.js`.

### 3.2 Endpoint-Specific Upstash Sliding-Window Rate Limiting & Reliable IP Resolution
- **Independent Rate Limiting Buckets:** Separate sliding-window rate-limiting buckets govern feedback submissions (max 3 req/IP/hour), endorsements (max 10 req/IP/hour), and revalidation triggers (max 5 req/hour).
- **Reliable Vercel IP Resolution:** Inspects headers in priority order: `x-vercel-forwarded-for`, `x-real-ip`, and `x-forwarded-for`, extracting the first valid IP address with a `127.0.0.1` fallback.

### 3.3 Notion Concurrency Limitations (Last-Write-Wins Flag)
- **Architectural Limitation Acknowledgment:** Because Notion's REST API lacks atomic increment operations or version conflict error codes, concurrent endorsements implement a standard Last-Write-Wins approach.

### 3.4 Client-Side Session Recovery, Form State & Image Optimization Strategy
- **Form State Protection:** Interactive feedback drawers utilize local browser session storage to prevent accidental data loss.
- **Media Optimization & Remote Patterns:** Heavy use of Next.js `next/image` component leveraging strict remote patterns configured in `next.config.js` for external assets (`prod-files-secure.s3.us-west-2.amazonaws.com` for Notion files and `avatars.githubusercontent.com` for GitHub avatars).

---

## 4. DOMAIN PILLARS, NOTION DATABASE SCHEMAS & SETUP INSTRUCTIONS
### 4.1 Structural Pillar Definitions
1. **Repositories & Commits:** Active source code repositories sourced from Notion and enriched with build-time GitHub commit metrics.
2. **Activity Logs:** Daily engineering explorations and technical study notes.
3. **Professional Insights:** Rigorous architectural case studies and trade-off evaluations.
4. **Direct Line (Contact):** Secure communication channel supporting `DIRECT_LINE` and `OPINION` types.

### 4.2 Notion Database Property Schemas & Explicit ID Mappings
Developers must provision four separate Notion databases within their workspace, share them with the Internal Integration, and map their environment IDs explicitly:
- **Activity Logs (`NOTION_LOGS_DB_ID`):** `Title` (Title), `Summary` (Rich text), `Tags` (Multi-select), `VideoUrl` (URL), `Approvals` (Number), `Date` (Date), `Published` (Checkbox).
- **Professional Insights (`NOTION_INSIGHTS_DB_ID`):** `Title` (Title), `Context` (Rich text), `Challenges` (Rich text), `TradeOffs` (Rich text), `Tags` (Multi-select), `VideoUrl` (URL), `Approvals` (Number), `Date` (Date), `Published` (Checkbox).
- **Repositories & Commits (`NOTION_REPOS_DB_ID`):** `Title` (Title), `RepoName` (Rich text), `Description` (Rich text), `Url` (URL), `Stargazers` (Number), `CommitCount` (Number), `LastCommitAt` (Date), `Language` (Select), `Published` (Checkbox).
- **Direct Line / Notes (`NOTION_NOTES_DB_ID`):** `MessageTitle` (Title), `MessageBody` (Rich text), `AuthorName` (Rich text), `AuthorContact` (Rich text), `Type` (Select: `DIRECT_LINE` | `OPINION`), `TargetId` (Rich text property for optional resource contextualization).

---

## 5. ACCESSIBILITY, SEO & MEDIA ARCHITECTURE
### 5.1 WCAG 2.1 AA Accessibility Standards
- Keyboard operability, high-contrast focus rings (`ring-2 ring-teal-400 ring-offset-2 ring-offset-slate-950`), minimum 4.5:1 text contrast, `aria-live="polite"`, and `prefers-reduced-motion` compliance.

### 5.2 Search Engine Optimization & Dynamic Metadata Generation
- **Sitemap & Robots Convention:** Implemented via standalone Next.js 14 App Router files (`app/sitemap.ts` and `app/robots.ts` exporting default async functions) generating dynamic XML feeds paired with `generateMetadata` and JSON-LD structured schemas.

### 5.3 Rich Media Facade Pattern
- Lightweight interactive placeholder cards for YouTube and Loom embeds, loading heavy iframes only upon explicit user interaction.

---

## 6. ERROR HARDENING, BOUNDARIES & TESTING GOVERNANCE
### 6.1 Mandatory Next.js UI Error Boundaries & `"use client"` Split
- Strict separation of boundaries: Server Components handle data fetching, normalizers, and two-step recursive block retrieval, while interactive elements explicitly declare `"use client"` boundaries.
- Error resilience: `loading.tsx`, `error.tsx`, and `not-found.tsx`.

### 6.2 Fail-Fast Environment Validation (Shared Startup Module)
- Strict Zod environment schema housed within a shared configuration module (`lib/env.ts`), imported directly at server startup points (data adapters and API route handlers) to validate environment variables securely without incurring per-request middleware overhead.

### 6.3 Testing Suite & Environment Separation (Jest & jsdom)
- Manual Jest and React Testing Library configuration (`jest.config.js`) enforcing an explicit minimum line coverage threshold of 80%. 
- **Environment Separation:** Server-side adapters, validators, and normalizers are tested in isolation using `testEnvironment: 'node'`, while client UI components use `testEnvironment: 'jsdom'`.

---

## 7. COMPLETE TOOLCHAIN, CONFIGURATION MANIFEST & OPERATIONAL PHASES
### 7.1 Pinned Toolchain & Dependency Matrix
- `next`: `14.2.x`, `react` / `react-dom`: `18.3.x`, `typescript`: `5.4.x`, `tailwindcss`: `3.4.x`, `@tailwindcss/typography`: `0.5.x`, `notion-to-md`: `^3.1.x`, `react-markdown`: `9.x`, `remark-gfm`: `4.x`, `rehype-sanitize`: `6.x`, `jest`: `29.7.0`, `jest-environment-jsdom`: `29.7.0`, `@testing-library/react`: `^16.x`, `@testing-library/dom`: `^10.x`, `@testing-library/jest-dom`: `^6.x`, `@notionhq/client`: `2.2.x`, `@upstash/ratelimit` / `@upstash/redis`: `1.x` / `1.30.x`, `zod`: `3.23.x`.

### 7.2 Configuration Manifests (`vercel.json`, `next.config.js`, `jest.config.js`, `.gitignore`)
- **`vercel.json`:** 
  ```json
  {
    "crons": [
      {
        "path": "/api/revalidate",
        "schedule": "0 0 * * *"
      }
    ]
  }
  ```
- **`next.config.js`:** Configured with strict remote patterns for Notion S3 assets and GitHub avatars, alongside global CSP security headers.
- **`jest.config.js`:** Standard Next.js Jest configuration template supporting TypeScript paths and environment overrides.
- **`.gitignore`:** Ignores `node_modules`, `.next`, `.env`, coverage reports, and build artifacts.

### 7.3 Master Environment Variables (.env.example Manifest)
- `NEXT_PUBLIC_SITE_URL`, `GITHUB_USERNAME` (Server-side only), `NOTION_TOKEN` (Server-only secret), `NOTION_LOGS_DB_ID`, `NOTION_INSIGHTS_DB_ID`, `NOTION_REPOS_DB_ID`, `NOTION_NOTES_DB_ID`, `GITHUB_TOKEN` (Optional), `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `REVALIDATE_SECRET`.

### 7.4 Structured Execution Phases for Autonomous Agents
- **Phase 1 (Scaffolding & Environment):** Initialize Next.js 14.2.x App Router, TypeScript strict mode, Tailwind CSS with Typography, Zod startup validation modules (`lib/env.ts`), manual Jest testing suite (`jest.config.js`) with test environment separation (`node` vs `jsdom`), `vercel.json`, `next.config.js`, and standalone SEO sitemap/robots files (`app/sitemap.ts`, `app/robots.ts`).
- **Phase 2 (Service Adapters & Normalization):** Implement Notion SDK two-step fetching with recursive block pagination and exhaustive `client.paginate()`, seed JSON fallback handling (`data/seed-fallback.json`), normalizer layers with server-side `Published === true` filtering (`generateStaticParams` at build time and `notFound()` at runtime), 429 exponential backoff retries, build-time static GitHub repository enrichment, and Upstash rate-limiting middleware.
- **Phase 3 (Accessibility & UI Components):** Build WCAG 2.1 AA compliant components, media facade embedding cards, custom-configured `rehype-sanitize` Markdown renderers, Next.js image optimization strategies, and session-persistent interactive feedback drawers with explicit `"use client"` directives.
- **Phase 4 (API Routes & Boundaries):** Configure ISR revalidation pipelines with correct top-level `tags` syntax in `fetch`, Vercel single daily cron job integrations, rate-limited `/api/revalidate` endpoints validating `x-vercel-cron` infrastructure headers (or SHA-256 hashed Bearer token checks) invoking both `revalidateTag('notion-cms')` and `revalidateTag('github-data')` with explicit `runtime = 'nodejs'`, write-only Direct Line ingestion handlers targeting `NOTION_NOTES_DB_ID`, target-aware endorsement handlers, and UI boundaries.
- **Phase 5 (Testing & Production Verification):** Execute Jest test suites verifying ≥80% line coverage across both node and jsdom test suites, and perform production build validations (`npm run build`).
