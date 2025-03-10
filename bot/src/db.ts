import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

await prisma.$connect().catch((e) => {
  console.error(e)
  process.exit(1)
})
