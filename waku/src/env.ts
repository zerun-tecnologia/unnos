import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.string().default('development'),
})

export type Env = z.infer<typeof envSchema>

// eslint-disable-next-line node/no-process-env
export const env: Env = envSchema.parse(process.env)
