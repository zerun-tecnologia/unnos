import { prisma } from '@/lib/prisma'

export async function ListMatches() {
  const matches = await prisma.match.findMany({
    select: {
      id: true,
      createdAt: true,
      finishedAt: true,
      banned: {
        select: {
          user: true,
        },
      },
      gave: true,
      winner: true,
    },
  })

  const listFormatter = new Intl.ListFormat('pt', {
    style: 'long',
    type: 'conjunction',
  })

  const dateFormatter = new Intl.DateTimeFormat('pt', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

  return (
    <>
      <ul className="space-y-4">
        {matches.map((match) => (
          <li key={match.id}>
            <p>Partida {match.id}</p>
            <p>Criada: {dateFormatter.format(new Date(match.createdAt))}</p>
            <p>
              Finalizada:{' '}
              {match.finishedAt
                ? dateFormatter.format(new Date(match.finishedAt))
                : '~'}
            </p>
            <div className="grid grid-cols-3 gap-4 w-full">
              <p>Ganhou: {match.winner?.username}</p>
              <p>
                Deu: {listFormatter.format(match.gave.map((u) => u.username))}
              </p>
              <p>
                Banidos:{' '}
                {listFormatter.format(match.banned.map((u) => u.user.username))}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
