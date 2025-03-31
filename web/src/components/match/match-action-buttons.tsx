'use client'
import { Button } from '@heroui/react'
import { motion } from 'framer-motion'
import { SelectWinnerModal } from './match-select-winner-modal'


export function MatchActionButtons() {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="flex gap-2"
    >
      <Button variant="bordered">
        Close Match
      </Button>
      <SelectWinnerModal />
    </motion.div>
  )
}
