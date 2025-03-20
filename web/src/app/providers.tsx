'use client'

import { queryClient } from '@/lib/query'
import { HeroUIProvider } from '@heroui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren & {
  session: Session | null
}

export function Providers({ children, session }: Props) {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={router.push}>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </HeroUIProvider>
  )
}
