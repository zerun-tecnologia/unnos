'use client'

import { PropsWithChildren } from 'react'
import { HeroUIProvider } from '@heroui/react'

type Props = PropsWithChildren

export function Providers({ children }: Props) {
  return <HeroUIProvider>{children}</HeroUIProvider>
}
