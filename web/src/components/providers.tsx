'use client'

import type { PropsWithChildren } from 'react'

import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { useRouter_UNSTABLE as useRouter } from 'waku'

import { queryClient } from '../lib/query'

type Props = PropsWithChildren

export function Providers({ children }: Props) {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={(to, options) => router.push(to as any, options)}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <ToastProvider />
    </HeroUIProvider>
  )
}
