import { prisma } from '@/lib/prisma'

export async function ListUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      matches_winner: {
        select: {
          id: true,
        },
      },
      matches_banned: {
        select: {
          id: true,
        },
      },
      matches_gave: {
        select: {
          id: true,
        },
      },
    },
  })

  return (
    <>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id}>
            <p>{user.username}</p>
            <div className="grid grid-cols-3">
              <p>Vitórias: {user.matches_winner.length}</p>
              <p>Bans: {user.matches_banned.length}</p>
              <p>Dadas: {user.matches_gave.length}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
