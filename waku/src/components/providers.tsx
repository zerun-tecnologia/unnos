'use client'

import type { PropsWithChildren } from 'react'
import { HeroUIProvider } from '@heroui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from 'src/lib/query'
import { useRouter_UNSTABLE as useRouter } from 'waku'

type Props = PropsWithChildren

export function Providers({ children }: Props) {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={(to, options) => router.push(to as any, options)}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </HeroUIProvider>
  )
}
