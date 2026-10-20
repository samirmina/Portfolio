import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().or(z.literal('')),

  GITHUB_USERNAME: z.string().min(1),
  NOTION_TOKEN: z.string().min(1),
  NOTION_LOGS_DB_ID: z.string().min(1),
  NOTION_INSIGHTS_DB_ID: z.string().min(1),
  NOTION_REPOS_DB_ID: z.string().min(1),
  NOTION_NOTES_DB_ID: z.string().min(1),
  GITHUB_TOKEN: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  REVALIDATE_SECRET: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error(
      'Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    );
    process.exit(1);
  }
  return parsed.data;
}

export const env = validateEnv();
