export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { env } from '../../../lib/env';
import { notion } from '../../../src/lib/notion';

export async function GET(): Promise<NextResponse> {
  const results: Record<string, { status: string; message: string }> = {};

  // Test Notion connection
  try {
    const response = await notion.databases.query({
      database_id: env.NOTION_LOGS_DB_ID,
      page_size: 1,
    });
    results.notion = {
      status: 'ok',
      message: `Connected. Found ${response.results.length} entries in Activity Logs DB.`,
    };
  } catch (error: unknown) {
    results.notion = {
      status: 'error',
      message: (error as Error)?.message || 'Unknown error',
    };
  }

  // Test GitHub connection
  try {
    const response = await fetch(
      `https://api.github.com/users/${env.GITHUB_USERNAME}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'portfolio-health-check',
          ...(env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` }
            : {}),
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      results.github = {
        status: 'ok',
        message: `Connected. User: ${data.login}, Public repos: ${data.public_repos}`,
      };
    } else {
      results.github = {
        status: 'error',
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error: unknown) {
    results.github = {
      status: 'error',
      message: (error as Error)?.message || 'Unknown error',
    };
  }

  // Test each Notion database
  const dbChecks = [
    { name: 'Activity Logs', id: env.NOTION_LOGS_DB_ID },
    { name: 'Professional Insights', id: env.NOTION_INSIGHTS_DB_ID },
    { name: 'Repositories', id: env.NOTION_REPOS_DB_ID },
    { name: 'Direct Line / Notes', id: env.NOTION_NOTES_DB_ID },
  ];

  for (const db of dbChecks) {
    try {
      const response = await notion.databases.query({
        database_id: db.id,
        page_size: 1,
      });
      results[`notion_${db.name.toLowerCase().replace(/\s+/g, '_')}`] = {
        status: 'ok',
        message: `Found ${response.results.length} entries.`,
      };
    } catch (error: unknown) {
      results[`notion_${db.name.toLowerCase().replace(/\s+/g, '_')}`] = {
        status: 'error',
        message: (error as Error)?.message || 'Unknown error',
      };
    }
  }

  const allOk = Object.values(results).every((r) => r.status === 'ok');

  return NextResponse.json(
    {
      overall: allOk ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks: results,
    },
    { status: allOk ? 200 : 503 }
  );
}