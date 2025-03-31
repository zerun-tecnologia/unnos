import { motion } from 'framer-motion'

import { GlassmorphicCard } from '../glassmorphic-card'

interface BannedUser {
  user: {
    id: string
    username: string
  }
  count: number
}

interface BannedUsersListProps {
  bannedUsers: BannedUser[]
}

export function BannedUsersList({ bannedUsers }: BannedUsersListProps) {
  if (bannedUsers.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/50 rounded-lg text-muted-foreground">
        No banned users for this match
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bannedUsers.map((bannedUser, index) => (
        <motion.div
          key={bannedUser.user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <GlassmorphicCard className="flex items-center justify-between" whileHover="none">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-lg font-semibold">
                {bannedUser.user.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <div className="font-medium">{bannedUser.user.username}</div>
                <div className="text-xs text-muted-foreground">
                  ID:
                  {bannedUser.user.id}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center px-3 py-1 rounded-full bg-destructive/10 text-destructive font-medium text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                {bannedUser.count}
                {' '}
                {bannedUser.count === 1 ? 'ban' : 'bans'}
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>
      ))}
    </div>
  )
}
