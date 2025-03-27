'use client'

import type { PropsWithChildren } from 'react'

import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { queryClient } from '../lib/query'

type Props = PropsWithChildren

export function Providers({ children }: Props) {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={router.push}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <ToastProvider />
    </HeroUIProvider>
  )
}
