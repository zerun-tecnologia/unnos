'use client'

import { MatchHeading } from '@/components/match/match-heading'
import { MatchTabs } from '@/components/match/match-tabs'
import { PageTransition } from '@/components/transitions'
import { MatchProvider } from '@/contexts/match-context'

export default function MatchDetail({ params: { id } }: { params: { id: string } }) {
  const matchId = Number.parseInt(id)

  return (
    <MatchProvider id={matchId}>
      <PageTransition>
        <div className="py-8">
          <MatchHeading />
          <MatchTabs />
        </div>
      </PageTransition>
    </MatchProvider>
  )
}
