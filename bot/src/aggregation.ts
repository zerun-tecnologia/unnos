import { prisma } from "./db"

type UserStats = {
  username: string
  winner: number
  banned: number
  gave: number
}

export async function getSeasonStatsWithAggregation(guildId: string, seasonId: string): Promise<UserStats[]> {
  // Get wins count per user
  const winsQuery = prisma.user.findMany({
    where: {
      guilds: {
        some: {
          id: guildId
        }
      },
      matches_winner: {
        some: {
          seasonId
        }
      }
    },
    select: {
      username: true,
      _count: {
        select: {
          matches_winner: {
            where: {
              guildId,
              seasonId
            }
          }
        }
      }
    }
  })

  // Get bans count per user
  const bansQuery = prisma.user.findMany({
    where: {
      guilds: {
        some: {
          id: guildId
        }
      },
      matches_banned: {
        some: {
          seasonId
        }
      }
    },
    select: {
      username: true,
      _count: {
        select: {
          matches_banned: {
            where: {
              guildId,
              seasonId
            }
          }
        }
      }
    }
  })

  // Get gives count per user
  const givesQuery = prisma.user.findMany({
    where: {
      guilds: {
        some: {
          id: guildId
        }
      },
      matches_gave: {
        some: {
          seasonId
        }
      }
    },
    select: {
      username: true,
      _count: {
        select: {
          matches_gave: {
            where: {
              guildId,
              seasonId
            }
          }
        }
      }
    }
  })

  // Execute all queries in parallel
  const [wins, bans, gives] = await Promise.all([winsQuery, bansQuery, givesQuery])

  // Merge results
  const userStatsMap = new Map<string, UserStats>()

  // Process wins
  wins.forEach(user => {
    userStatsMap.set(user.username, {
      username: user.username,
      winner: user._count.matches_winner,
      banned: 0,
      gave: 0
    })
  })

  // Process bans
  bans.forEach(user => {
    const existing = userStatsMap.get(user.username)
    if (existing) {
      existing.banned = user._count.matches_banned
    } else {
      userStatsMap.set(user.username, {
        username: user.username,
        winner: 0,
        banned: user._count.matches_banned,
        gave: 0
      })
    }
  })

  // Process gives
  gives.forEach(user => {
    const existing = userStatsMap.get(user.username)
    if (existing) {
      existing.gave = user._count.matches_gave
    } else {
      userStatsMap.set(user.username, {
        username: user.username,
        winner: 0,
        banned: 0,
        gave: user._count.matches_gave
      })
    }
  })

  return Array.from(userStatsMap.values())
}

// Usage example:
// const stats = await getSeasonStatsWithAggregation('your-season-id-here')
