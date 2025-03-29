'use client'

import { FilterInput } from '@/components/matches/match-filter-input'
import { HeadingSection } from '@/components/matches/match-heading-section'
import { MatchList } from '@/components/matches/match-list'

export default function Matches() {
  return (
    <div className="max-w-[1200px] mx-auto my-0 w-full">
      <HeadingSection />
      <FilterInput />
      <MatchList />
    </div>
  )
}
