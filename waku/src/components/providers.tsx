'use client'

import type { PropsWithChildren } from 'react'
import { HeroUIProvider } from '@heroui/react'
import { useRouter_UNSTABLE as useRouter } from 'waku'

type Props = PropsWithChildren

export function Providers({ children }: Props) {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={router.push}>
      {children}
    </HeroUIProvider>
  )
}
