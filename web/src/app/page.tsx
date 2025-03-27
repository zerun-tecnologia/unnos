'use client'

import { Button, Link } from '@heroui/react'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <>
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto px-4"
        >
          <div className="inline-flex items-center rounded-full bg-primary/10 text-primary mb-4 px-3 py-1 text-sm font-medium">
            <svg
              className="w-4 h-4 mr-1.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            Welcome to MatchHub
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Create and manage matches
            <br />
            with elegance
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            A beautifully designed platform for creating matches, managing bans,
            and tracking competitions across your guilds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Link to="/create-match" size="lg" className="rounded-full px-8">
              Create New Match
            </Link> */}
            <Button
              as={Link}
              href="/matches"
              size="lg"
              variant="bordered"
              className="rounded-full px-8"
            >
              Browse Matches
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-5xl mt-16 overflow-hidden rounded-xl"
        >
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/20 z-0"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Features Overview
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Create Matches</h3>
                  <p className="text-muted-foreground text-sm">
                    Easily create new matches with customizable settings and
                    invite participants
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Manage Bans</h3>
                  <p className="text-muted-foreground text-sm">
                    Track and manage banned users with detailed information and
                    history
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Declare Winners</h3>
                  <p className="text-muted-foreground text-sm">
                    Set match winners and keep track of competition results
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
