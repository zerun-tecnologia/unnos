import * as v from 'valibot'

const schema = v.object({
  AUTH_DISCORD_ID: v.string(),
  AUTH_DISCORD_TOKEN: v.string(),
  DATABASE_URL: v.string(),
})

export type Env = v.InferOutput<typeof schema>

export const env = v.parse(schema, process.env)
