import * as v from 'valibot'

const schema = v.object({
  CLIENT_ID: v.string(),
  TOKEN: v.string(),
  DATABASE_URL: v.string(),
})

export type Env = v.InferOutput<typeof schema>

export const env = v.parse(schema, process.env)
