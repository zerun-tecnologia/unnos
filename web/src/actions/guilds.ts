'use server'

import type { Guild } from '@prisma/client'

import { prisma } from '@/lib/prisma'

export async function listGuilds(): Promise<Guild[]> {
  const data = await prisma.guild.findMany()

  return data
}
