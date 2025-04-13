import { z } from 'zod'

export const setMatchGavesFormSchema = z.object({
  gaves: z.array(z.string()),
})

export type SetMatchGavesMatchType = z.infer<typeof setMatchGavesFormSchema>
export type SetMatchGavesMatchInput = z.input<typeof setMatchGavesFormSchema>
export type SetMatchGavesMatchOutput = z.output<typeof setMatchGavesFormSchema>
