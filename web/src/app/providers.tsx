'use client'

import { queryClient } from '@/lib/query'
import { HeroUIProvider } from '@heroui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren

export function Providers({ children }: Props) {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={router.push}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </HeroUIProvider>
  )
}
