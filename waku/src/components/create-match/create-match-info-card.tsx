'use client'
import { Card, CardBody, CardHeader } from '@heroui/react'
import { motion } from 'framer-motion'

export function CreateMatchInfoCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mt-8"
    >

      <Card className="bg-secondary/50 border-secondary/20">
        <CardHeader>
          <h1 className="text-lg">What happens next?</h1>
        </CardHeader>
        <CardBody>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Your match will be created with "Open" status</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>You can add participants and manage bans</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>When ready, you can declare a winner and close the match</span>
            </li>
          </ul>
        </CardBody>
      </Card>
    </motion.div>
  )
}
