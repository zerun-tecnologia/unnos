import type { ReactNode } from 'react'

import { useQuery } from '@tanstack/react-query'
import { createContext, use } from 'react'

import type { MatchDetail } from '@/actions/match'

import { retrieveMatchById } from '@/actions/match'

type MatchContextData = {
  match?: MatchDetail | null
  isLoading: boolean
}

const MatchContext = createContext<MatchContextData | undefined>(undefined)

export function MatchProvider({ id, children }: { id: number, children: ReactNode }) {
  const { data: match, isFetching } = useQuery({
    queryKey: ['retrieve-match', id],
    queryFn: async () => await retrieveMatchById(id),
  })

  return (
    <MatchContext value={{ match, isLoading: isFetching }}>
      {children}
    </MatchContext>
  )
}

export function useMatch() {
  const context = use(MatchContext)
  if (!context) {
    throw new Error('useMatch must be used within a MatchProvider')
  }
  return context
}
