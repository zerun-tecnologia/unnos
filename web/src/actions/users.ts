'use server'
import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

export type UserFilters = {
  username?: string
  guilds?: string[]
}

export type EachUser = {
  id: string
  username: string
  guilds: string[]
}

export async function fetchUsers(query?: Query<UserFilters>): Promise<PaginatedQueryResponse<EachUser>> {
  const { page = 1, perPage = 20 } = query ?? {}
  const where: Prisma.UserWhereInput = {
    username: { contains: query?.filters?.username, mode: 'insensitive' },
    guilds: {
      some: {
        id: { in: query?.filters?.guilds },
      },
    },
  }

  const [data, count] = await Promise.all([
    prisma.user.findMany(
      {
        where,
        take: perPage,
        skip: perPage * (page - 1),
        orderBy: {
          id: 'asc',
        },
        include: {
          guilds: {
            omit: {
              name: true,
            },
          },
        },
      },
    ),
    prisma.user.count({ where }),
  ])

  return {
    page,
    perPage,
    total: count,
    items: data.map(user => ({
      ...user,
      guilds: user.guilds.map(guild => guild.id),
    })),
  }
}

export async function fetchUsersUnpaged(query?: Query<UserFilters>): Promise<EachUser[]> {
  const where: Prisma.UserWhereInput = {
    username: { contains: query?.filters?.username, mode: 'insensitive' },
    guilds: {
      some: {
        id: { in: query?.filters?.guilds },
      },
    },
  }

  const data = await prisma.user.findMany(
    {
      where,
      orderBy: {
        id: 'asc',
      },
      include: {
        guilds: {
          omit: {
            name: true,
          },
        },
      },
    },
  )

  console.log('data', data)

  return data.map(user => ({
    ...user,
    guilds: user.guilds.map(guild => guild.id),
  }))
}
