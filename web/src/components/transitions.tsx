'use client'
import type { ReactNode } from 'react'

import { motion } from 'framer-motion'

import { opacityAnimation } from '../lib/motion'

type PageTransitionProps = {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={opacityAnimation}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}
