import { Button } from '@heroui/react'
import Link from 'next/link'

export function HeadingSection() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Matches</h1>
        <p className="text-muted-foreground">
          Browse, filter and manage matches
        </p>
      </div>
      <Button
        as={Link}
        href="/create-match"
        className="mt-4 md:mt-0 rounded-full"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Match
      </Button>
    </div>
  )
}
