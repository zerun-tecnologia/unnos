'use client'
import { Card, CardBody, CardHeader, Tab, Tabs } from '@heroui/react'
import { motion } from 'framer-motion'

import { MatchBansContent } from './match-bans-content'
import { MatchGavesContent } from './match-gaves-content'
import { MatchParticipantsContent } from './match-paticipants-content'
import { SelectBannedsModal } from './match-select-banneds-modal'
import { SelectWhoGaveModal } from './match-select-who-gave-modal'

const tabItems = [{
  title: 'Participantes',
  description: 'Participantes dessa partida',
  content: <MatchParticipantsContent />,
}, {
  title: 'Banimentos',
  description: 'Banimentos dessa partida',
  content: <MatchBansContent />,
  actionButton: <SelectBannedsModal />,
}, {
  title: 'Deram',
  description: 'Deram essa partida',
  content: <MatchGavesContent />,
  actionButton: <SelectWhoGaveModal />,
}]

export function MatchTabs() {
  return (
    <Tabs>
      {tabItems.map(tab => (
        <Tab key={tab.title} title={tab.title}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Card>
              <CardHeader className="flex justify-between items-center">
                <h2 className="font-semibold text-xl">{tab.description}</h2>
                {tab.actionButton}
              </CardHeader>
              <CardBody>
                {tab.content}
              </CardBody>
            </Card>
          </motion.div>
        </Tab>
      ))}
    </Tabs>
  )
}
