import { z } from 'zod'

export const setMatchWinnerFormSchema = z.object({
  winnerId: z.string().min(1, { message: 'Selecione um vencedor' }),
})

export type SetMatchWinnerMatchType = z.infer<typeof setMatchWinnerFormSchema>
export type SetMatchWinnerMatchInput = z.input<typeof setMatchWinnerFormSchema>
export type SetMatchWinnerMatchOutput = z.output<typeof setMatchWinnerFormSchema>
