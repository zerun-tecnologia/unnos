import { z } from 'zod'

export const setMatchBannedsFormSchema = z.object({
  banneds: z.array(z.object({
    id: z.string().min(1, { message: 'Selecione um banido' }),
    amount: z.number().min(1, { message: 'Selecione uma quantidade' }),
  })),
})

export type SetMatchBannedsMatchType = z.infer<typeof setMatchBannedsFormSchema>
export type SetMatchBannedsMatchInput = z.input<typeof setMatchBannedsFormSchema>
export type SetMatchBannedsMatchOutput = z.output<typeof setMatchBannedsFormSchema>
