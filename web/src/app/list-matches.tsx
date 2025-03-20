import { prisma } from '@/lib/prisma'

export async function ListMatches() {
  const matches = await prisma.match.findMany({
    select: {
      id: true,
      banned: true,
      gave: true,
      winner: true,
    },
  })

  const formatter = new Intl.ListFormat('pt', {
    style: 'long',
    type: 'conjunction',
  })

  return (
    <>
      <ul className="space-y-4">
        {matches.map((match) => (
          <li key={match.id}>
            <p>Partida {match.id}</p>
            <div className="grid grid-cols-3 gap-4 w-full">
              <p>Ganhou: {match.winner?.username}</p>
              <p>Deu: {formatter.format(match.gave.map((u) => u.username))}</p>
              <p>
                Banidos: {formatter.format(match.banned.map((u) => u.username))}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
