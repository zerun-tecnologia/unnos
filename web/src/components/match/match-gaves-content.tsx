import { Avatar } from '@heroui/react'

import { useMatch } from '@/contexts/match-context'

export function MatchGavesContent() {
  const { match } = useMatch()

  if (!match) {
    return null
  }

  const gaveParticipants = match.participants.filter(participant =>
    match.gave.some(gave => gave.id === participant.id),
  )

  return (
    <>
      {match.gave.length === 0
        ? (
            <div className="text-center p-6 bg-muted/50 rounded-lg text-muted-foreground">
               Nenhuma dada registrada nessa partida.
            </div>
          )
        : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gaveParticipants.map(participant => (
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
