import { Avatar } from '@heroui/react'

import { useMatch } from '@/contexts/match-context'

export function MatchBansContent() {
  const { match } = useMatch()

  if (!match) {
    return null
  }

  const bannedParticipants = match.participants.filter(participant =>
    match.banned.some(ban => ban.userId === participant.id),
  )
  return (
    <>
      {match.banned.length === 0
        ? (
            <div className="text-center p-6 bg-muted/50 rounded-lg text-muted-foreground">
              Nenhum banimento registrado nesta partida
            </div>
          )
        : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bannedParticipants.map(participant => (
                <div
                  key={participant.id}
                  className="flex items-center p-3 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <Avatar className="h-10 w-10" />
                  <div className="ml-3">
                    <div className="font-medium">{participant.username}</div>
                    <div className="text-xs text-muted-foreground">
                      ID:
                      {participant.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
    </>
  )
}
