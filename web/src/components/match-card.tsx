'use client'

import { Chip } from '@heroui/react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { GlassmorphicCard } from './glassmorphic-card'

type MatchCardProps = {
  id: number
  name?: string
  guild: {
    id: string
    name: string
  }
  status: string
  participantsCount: number
  winnerId?: string
  createdAt: string
}

export function MatchCard({
  id,
  name,
  guild,
  status,
  participantsCount,
  winnerId,
  createdAt,
}: MatchCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-500/20 text-green-700 border-green-500/30'
      case 'in progress':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
      case 'completed':
        return 'bg-purple-500/20 text-purple-700 border-purple-500/30'
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    }
  }

  return (
    <Link href={`/matches/${id}`}>
      <GlassmorphicCard className="h-full">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg">
                {name || `Match #${id}`}
              </h3>
              <p className="text-sm text-muted-foreground">{guild.name}</p>
            </div>
            <Chip
              variant="bordered"
              className={`uppercase text-xs font-semibold ${getStatusColor(status)}`}
            >
              {status}
            </Chip>
          </div>

          <div className="flex-grow">
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {participantsCount}
                {' '}
                participants
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
            <span>{formattedDate}</span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center font-medium text-primary"
            >
              View Details
              <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>
        </div>
      </GlassmorphicCard>
    </Link>
  )
}
