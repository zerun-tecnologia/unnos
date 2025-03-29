'use server'

import type { Query } from '@/@types/global'
import type { Match, Prisma , Guild} from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type { CreateMatchType } from '../app/validation/create-match-form-schema'

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

export async function fetchMatches(query?: Query): Promise<(Match & {guild: Guild})[]> {
  const { page = 1, perPage = 20 } = query ?? {}
  return await prisma.match.findMany(
    {
      where: {
        name: query?.search,
      },
      take: perPage,
      skip: perPage * (page - 1),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        guild: true,
      },
    },
  )
}
