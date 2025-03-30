'use client'
import { Avatar, AvatarGroup, Badge, Button, Card, CardBody, CardHeader, Chip, Tab, Tabs } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import Link from 'next/link'

import { MatchDetail, retrieveMatchById } from '@/actions/match'
import { PageTransition } from '@/components/transitions'

const tabItems = [{
  title: 'Participantes',
  description: 'Participantes dessa partida',
  content: (match: MatchDetail) => (
    <>
      {match.participants.length === 0
        ? (
            <div className="text-center p-6 bg-muted/50 rounded-lg text-muted-foreground">
              No participants added yet
            </div>
          )
        : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {match.participants.map(participant => (
                <div
                  key={participant.id}
                  className="flex items-center p-3 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarGroup className="bg-primary/10 text-primary">
                      {participant.username.charAt(0).toUpperCase()}
                    </AvatarGroup>
                  </Avatar>
                  <div className="ml-3">
                    <div className="font-medium">{participant.username}</div>
                    <div className="text-xs text-muted-foreground">
                      ID:
                      {participant.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
    </>
  ),
}, {
  title: 'Banimentos',
  description: 'Banimentos dessa partida',
  content: (match: MatchDetail) => {
    const bannedParticipants = match.participants.filter(participant =>
      match.banned.some(ban => ban.userId === participant.id),
    )
    return (
      <>
        {match.participants.length === 0
          ? (
              <div className="text-center p-6 bg-muted/50 rounded-lg text-muted-foreground">
                No participants added yet
              </div>
            )
          : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bannedParticipants.map(participant => (
                  <div
                    key={participant.id}
                    className="flex items-center p-3 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarGroup className="bg-primary/10 text-primary">
                        {participant.username.charAt(0).toUpperCase()}
                      </AvatarGroup>
                    </Avatar>
                    <div className="ml-3">
                      <div className="font-medium">{participant.username}</div>
                      <div className="text-xs text-muted-foreground">
                        ID:
                        {participant.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </>
    )
  },
}, {
  title: 'Deram',
  description: 'Deram essa partida',
  content: (match: MatchDetail) => {
    const gaveParticipants = match.participants.filter(participant =>
      match.gave.some(gave => gave.id === participant.id),
    )

    return (
      <>
        {match.participants.length === 0
          ? (
              <div className="text-center p-6 bg-muted/50 rounded-lg text-muted-foreground">
                No participants added yet
              </div>
            )
          : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gaveParticipants.map(participant => (
                  <div
                    key={participant.id}
                    className="flex items-center p-3 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarGroup className="bg-primary/10 text-primary">
                        {participant.username.charAt(0).toUpperCase()}
                      </AvatarGroup>
                    </Avatar>
                    <div className="ml-3">
                      <div className="font-medium">{participant.username}</div>
                      <div className="text-xs text-muted-foreground">
                        ID:
                        {participant.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </>
    )
  },
}]

function MatchDetail({ params: { id } }: { params: { id: string } }) {
  const parsedId = Number.parseInt(id)
  const { data: match } = useQuery({
    queryKey: ['retrieve-mattch', parsedId],
    queryFn: async () => await retrieveMatchById(parsedId),
  })

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
    <PageTransition>
      <div className="py-8">
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
                <Badge
                  variant="faded"
                  className={`uppercase text-xs font-semibold ${getStatusColor(match.status)}`}
                >
                  {match.status}
                </Badge>
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex gap-2"
            >
              <Button variant="bordered">
                Close Match
              </Button>
              <Button onClick={() => { }}>
                Set Winner
              </Button>
            </motion.div>
          </div>
        </div>

        <Tabs>
          {tabItems.map(tab => (
            <Tab key={tab.title} title={tab.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <h2 className="font-semibold text-xl">{tab.description}</h2>
                  </CardHeader>
                  <CardBody>
                    {tab.content(match)}
                  </CardBody>
                </Card>
              </motion.div>
            </Tab>
          ))}

        </Tabs>

      </div>
    </PageTransition>
  )
}

export default MatchDetail
