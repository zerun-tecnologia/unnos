import { z } from 'zod'

export const createMatchSchema = z.object({
    name: z.string().optional(),
    guildId: z.string().min(1, { message: 'O nome do servidor é obrigatório' }),
    participants: z.array(
        z.object({
            id: z.string(),
            username: z.string(),
        })
    ).default([]),
})

export type CreateMatchType = z.infer<typeof createMatchSchema>
export type CreateMatchInput = z.input<typeof createMatchSchema>
export type CreateMatchOutput = z.output<typeof createMatchSchema>
