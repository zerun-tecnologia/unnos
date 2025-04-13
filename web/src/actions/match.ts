'use server'
import type { Guild, MatchBanned, Prisma, Match as PrismaMatch, User } from '@prisma/client'

import type { CreateMatchType } from '@/validation/create-match-form-schema'
import type { SetMatchWinnerMatchOutput } from '@/validation/set-match-winner-form-schema'

import { prisma } from '@/lib/prisma'

export type MatchFilters = {
  status?: string
}

export type EachMatchPaginated = PrismaMatch & { guild: Guild, participants: User[] }
export type MatchDetail = PrismaMatch & { guild: Guild, participants: User[], banned: MatchBanned[], gave: User[], winner: User | null }

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

export async function fetchMatches(query?: Query<MatchFilters>): Promise<PaginatedQueryResponse<EachMatchPaginated>> {
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
    page,
    perPage,
    total: count,
    items: data,
  }
}

export async function retrieveMatchById(id: number): Promise<MatchDetail | null> {
  const data = await prisma.match.findUnique({
    where: {
      id,
    },
    include: {
      guild: true,
      participants: true,
      banned: true,
      gave: true,
      winner: true,
    },
  })

  return data
}

export async function setMatchWinner(matchId: number, data: SetMatchWinnerMatchOutput) {
  await prisma.match.update({
    where: {
      id: matchId,
    },
    data: {
      winnerId: data.winnerId,
    },
  })
}

export async function setMatchBanneds(matchId: number, banneds: { id: string, amount: number }[]) {
  const operations = banneds.map(banned =>
    prisma.matchBanned.upsert({
      where: {
        matchId_userId: {
          matchId,
          userId: banned.id,
        },
      },
      create: {
        matchId,
        userId: banned.id,
        count: banned.amount,
      },
      update: {
        count: banned.amount,
      },
    }),
  )

  await prisma.$transaction(operations)
}

export async function setMatchGaves(matchId: number, gaves: string[]) {
  await prisma.match.update({
    where: {
      id: matchId,
    },
    data: {
      gave: {
        connect: gaves.map(gave => ({
          id: gave,
        })),
      },
    },
  })
}
