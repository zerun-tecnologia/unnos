'use client'
import { motion } from 'framer-motion'

export function CreateMatchHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-2">Create a New Match</h1>
      <p className="text-muted-foreground mb-8">Set up your match details and invite participants</p>
    </motion.div>
  )
}
