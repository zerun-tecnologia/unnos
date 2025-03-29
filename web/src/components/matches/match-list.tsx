import { fetchMatches } from '@/actions/match'
import { Button } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { MatchCard } from './match-card'

export function MatchList() {
    const matchQuery = useQuery({
        queryKey: ['fetch-matches'],
        queryFn: async () => await fetchMatches(),
    })

    const matchesList = matchQuery.data ?? []

    return (
        <div className="py-8">

            {matchesList.length === 0
                ? (
                    <div className="text-center py-12">
                        <div className="text-lg text-muted-foreground mb-4">
                            No matches found
                        </div>
                        <Button
                            as={Link}
                            href="/create-match"
                            variant="bordered"
                        >
                            Create a Match
                        </Button>
                    </div>
                )
                : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matchesList.map((match, index) => (
                            <motion.div
                                key={match.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                            >
                                <MatchCard
                                    guild={match.guild}
                                    createdAt={match.createdAt.toISOString()}
                                    id={match.id}
                                    participantsCount={0}
                                    status={match.status}
                                />

                            </motion.div>
                        ))}
                    </div>
                )}
        </div>
    )
}
