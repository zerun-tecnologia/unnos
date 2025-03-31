'use client'
import { Avatar, Chip } from '@heroui/react'
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import Link from 'next/link'

import { MatchActionButtons } from '@/components/match/match-action-buttons'
import { useMatch } from '@/contexts/match-context'

export function MatchHeading() {
  const { match } = useMatch()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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

  if (!match) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/matches" className="text-muted-foreground hover:text-foreground flex items-center mb-2 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to matches
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{match.name || `Match #${match.id}`}</h1>
            <Chip
              variant="faded"
              className={`uppercase text-xs font-semibold ${getStatusColor(match.status)}`}
            >
              {match.status}
            </Chip>
          </div>
          <div className="flex items-center text-muted-foreground mt-1">
            <span className="text-sm">{match.guild.name}</span>
            <span className="mx-2">•</span>
            <span className="text-sm">
              Created
              {formatDate(match.createdAt.toISOString())}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-1 ml-12"
        >

          <div
            className="flex items-center p-3 relative"
          >
            <Crown className="absolute inset-0 z-10 translate-x-1 fill-amber-500 rotate-[-30deg]" />
            <Avatar className="h-10 w-10" />
            <div className="ml-3">
              <div className="font-medium">{match.winner?.username}</div>
              <div className="text-xs text-muted-foreground">
                ID:
                {match.winner?.id}
              </div>
            </div>
            <Chip className="ml-4" variant="dot" color="warning">Vencedor</Chip>
          </div>

        </motion.div>
        <MatchActionButtons />
      </div>
    </div>
  )
}
