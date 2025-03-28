import { Button } from '@heroui/react'
import { useSession } from 'next-auth/react'

import { signInAction, signOutAction } from '@/actions/auth-actions'

export function AuthButton() {
  const { data, status } = useSession()

  if (status === 'loading') {
    return <Button isLoading={true} />
  }

  if (status === 'unauthenticated') {
    return (
      <form action={async () => {
        await signInAction()
      }}
      >
        <Button type="submit">Sign In</Button>
      </form>
    )
  }

  return (
    <form
      action={async () => {
        await signOutAction()
      }}
      className="flex items-center gap-2"
    >
      <p>{data?.user?.name}</p>
      <Button type="submit">Sign Out</Button>
    </form>
  )
}
