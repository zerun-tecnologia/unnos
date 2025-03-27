'use client'

import { Button, Input, Link } from '@heroui/react'
import { motion } from 'framer-motion'
import { useState } from 'react'

import { MatchCard } from '../../components/match-card'

// Mock data for matches
const MOCK_MATCHES = [
  {
    id: 1,
    name: 'Weekly Tournament',
    guild: { id: 'guild1', name: 'Gaming Heroes' },
    status: 'open',
    participantsCount: 12,
    createdAt: '2023-05-10T10:30:00Z',
  },
  {
    id: 2,
    name: 'Championship Finals',
    guild: { id: 'guild2', name: 'Pro Gamers' },
    status: 'in progress',
    participantsCount: 8,
    createdAt: '2023-05-12T14:20:00Z',
  },
  {
    id: 3,
    name: 'Casual Match',
    guild: { id: 'guild1', name: 'Gaming Heroes' },
    status: 'completed',
    participantsCount: 6,
    winnerId: 'user1',
    createdAt: '2023-05-08T09:15:00Z',
  },
  {
    id: 4,
    name: 'Ranked Match',
    guild: { id: 'guild3', name: 'Elite Squad' },
    status: 'open',
    participantsCount: 10,
    createdAt: '2023-05-13T16:45:00Z',
  },
  {
    id: 5,
    name: 'Practice Round',
    guild: { id: 'guild2', name: 'Pro Gamers' },
    status: 'completed',
    participantsCount: 4,
    winnerId: 'user2',
    createdAt: '2023-05-11T12:30:00Z',
  },
]

function Matches() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredMatches = MOCK_MATCHES.filter((match) => {
    // Filter by status
    if (statusFilter !== 'all' && match.status !== statusFilter) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        match.name?.toLowerCase().includes(query) ||
        match.guild.name.toLowerCase().includes(query)
      )
    }

    return true
  })

  return (
    <>
      <div className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Matches</h1>
            <p className="text-muted-foreground">
              Browse, filter and manage matches
            </p>
          </div>
          <Button
            as={Link}
            href="/create-match"
            className="mt-4 md:mt-0 rounded-full"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Match
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search matches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-48">
              {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          </div>
        </motion.div>

        {filteredMatches.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <MatchCard {...match} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Matches
