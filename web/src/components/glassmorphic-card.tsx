'use client'

import type { ReactNode } from 'react'

import { cn } from '@heroui/react'
import { motion } from 'framer-motion'

import { cardVariants } from '../lib/motion'

type GlassmorphicCardProps = {
  children: ReactNode
  className?: string
  whileHover?: 'none' | 'hover'
}

export function GlassmorphicCard({
  children,
  className,
  whileHover = 'hover',
}: GlassmorphicCardProps) {
  return (
    <>
      <motion.div
        className={cn(
          'glass-card p-6',
          className,
        )}
        initial="hidden"
        animate="visible"
        whileHover={whileHover === 'hover' ? 'hover' : undefined}
        whileTap="tap"
        variants={cardVariants}
      >
        {children}
      </motion.div>
    </>

  )
}
