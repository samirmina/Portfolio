import seed from './seed-fallback.json';

export type SeedActivityLog = (typeof seed.activityLogs)[number];
export type SeedInsight = (typeof seed.professionalInsights)[number];
export type SeedRepository = (typeof seed.repositories)[number];
export type SeedDirectLineNote = (typeof seed.directLine)[number];
export type SeedSearchRequest = (typeof seed.searchRequests)[number];

/** Returns the bundled seed fallback used when upstream APIs are unavailable. */
export function loadSeedFallback() {
  return seed;
}

export function loadSeedActivityLogs(): SeedActivityLog[] {
  return seed.activityLogs;
}

export function loadSeedProfessionalInsights(): SeedInsight[] {
  return seed.professionalInsights;
}

export function loadSeedRepositories(): SeedRepository[] {
  return seed.repositories;
}

export function loadSeedDirectLineNotes(): SeedDirectLineNote[] {
  return seed.directLine;
}

export function loadSeedSearchRequests(): SeedSearchRequest[] {
  return seed.searchRequests;
}