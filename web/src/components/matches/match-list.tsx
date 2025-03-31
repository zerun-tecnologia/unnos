import { Button, Skeleton } from '@heroui/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { fetchMatches } from '@/actions/match'

import { MatchCard } from './match-card'

export function MatchList() {
  const params = useSearchParams()
  const query = {
    search: params.get('search') ?? undefined,
    status: params.get('status') ?? undefined,
  }

  const matchQuery = useInfiniteQuery({
    queryKey: ['fetch-matches', query],
    queryFn: async ({ pageParam = 1 }) => await fetchMatches({
      search: query.search,
      filters: {
        status: query.status,
      },
      page: pageParam,
      perPage: 6,
    }),
    getNextPageParam: lastPage => lastPage.page + 1,
    initialPageParam: 1,
  })

  const matchesList = matchQuery.data?.pages.flatMap(page => page.items) ?? []
  const hasNextPage = matchQuery.data?.pages[0].total && matchQuery.data?.pages[0].total > matchesList.length

  return (
    <div className="py-8">
      {matchesList.length === 0 && !matchQuery.isFetching
        ? (
            <div className="text-center py-12">
              <div className="text-lg text-muted-foreground mb-4">
                No matches found
              </div>
              {(query.status === 'all' || query.status === 'open') && (
                <Button
                  as={Link}
                  href="/create-match"
                  variant="bordered"
                >
                  Create a Match
                </Button>
              )}
            </div>
          )

        : matchQuery.isFetching && matchesList.length === 0
          ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from(
                  { length: 6 },
                ).map((_, index) => (
                  <motion.div
                    key={`match-sekeleton${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                  >
                    <Skeleton className="w-full h-44 rounded-xl" />
                  </motion.div>
                ))}
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
                      createdAt={match.createdAt}
                      name={match.name ?? ''}
                      id={match.id}
                      participantsCount={match.participants.length}
                      status={match.status}
                    />

                  </motion.div>
                ))}
              </div>
            )}
      {matchQuery.isFetchingNextPage && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from(
            { length: 6 },
          ).map((_, index) => (
            <motion.div
              key={`match-sekeleton${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Skeleton className="w-full h-44 rounded-xl" />
            </motion.div>
          ))}
        </div>
      )}
      {!matchQuery.isFetching && hasNextPage
        && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
          >
            <Button onPress={() => matchQuery.fetchNextPage()}>Carregar mais</Button>
          </motion.div>
        )}
    </div>
  )
}
