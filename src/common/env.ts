import { env as baseEnv } from 'cloudflare:workers';
import { z } from 'zod';

export const envSchema = z.object({
  // secrets
  BOT_TOKEN: z.string(),
  WEBHOOK_SECRET: z.string().optional().describe('Random generated string to secure the webhook'),

  // variables
  WEBHOOK_PATH: z.string().startsWith('/').default('/'),
  ENVIRONMENT: z.enum(['development', 'production', 'staging']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

const parse = envSchema.safeParse(baseEnv);

if (!parse.success) {
  console.error('Invalid environment variables', parse.error.format());
  throw new Error('Invalid environment variables');
}

export const env = parse.data;
