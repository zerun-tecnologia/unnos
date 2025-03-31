import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3000),
  AUTH_DISCORD_ID: z.string(),
  AUTH_DISCORD_SECRET: z.string(),
})

// eslint-disable-next-line node/no-process-env
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.log('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
