'use server'

import { prisma } from '@/lib/prisma'

import type { CreateMatchType } from '../validation/create-match-form-schema'

export async function createMatch(input: CreateMatchType) {
  await prisma.match.create({
    data: {
      name: input.name,
      guildId: input.guildId,
      participants: {
        connectOrCreate: input.participants.map(participant => ({
          where: { id: participant.id },
          create: {
            id: participant.id,
            username: participant.username,
          },
        })),
      },
    },
  })
}
