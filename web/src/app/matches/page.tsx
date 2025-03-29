'use client'

import { FilterInput } from "@/components/matches/match-filter-input"
import { HeadingSection } from "@/components/matches/match-heading-section"
import { MatchList } from "@/components/matches/match-list"

function Matches() {
  return (
    <div className="">
      <HeadingSection />
      <FilterInput />
      <MatchList />

    </div>
  )
}

export default Matches
