'use server'

import type { Guild, Match, Prisma } from '@prisma/client'

import type { Query, PaginatedQueryResponse } from '@/@types/global'

import { prisma } from '@/lib/prisma'

import type { CreateMatchType } from '../app/validation/create-match-form-schema'

export async function createMatch(input: CreateMatchType) {
  const users = await prisma.user.findMany({
    where: {
      guilds: {
        some: {
          id: input.guildId,
        },
      },
    },
  })

  await prisma.match.create({
    data: {
      name: input.name,
      guildId: input.guildId,
      participants: {
        connectOrCreate: users.map(participant => ({
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

type MatchFilters = {
  status?: string
}

export async function fetchMatches(query?: Query<MatchFilters>): Promise<PaginatedQueryResponse<(Match & { guild: Guild, participants: number })>> {
  const { page = 1, perPage = 20 } = query ?? {}
  const where: Prisma.MatchWhereInput = {
    name: { contains: query?.search, mode: 'insensitive' },
    status: query?.filters?.status === 'all' ? undefined : query?.filters?.status,
  }

  const [data, count] = await Promise.all([
    prisma.match.findMany(
      {
        where,
        take: perPage,
        skip: perPage * (page - 1),
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          guild: true,
          participants: true,
        },
      },
    ), 
    prisma.match.count({ where }),
  ])

  return {
    page: page,
    perPage: perPage,
    total: count,
    items : data.map(match => ({
      ...match,
      participants: match.participants.length,
    }))
  }
}
