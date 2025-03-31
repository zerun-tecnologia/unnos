'use server'

import { signIn, signOut } from '@/auth'

export async function signInAction() {
  await signIn('discord', {
    redirectTo: '/',
  })
}

export async function signOutAction() {
  await signOut({
    redirectTo: '/',
  })
}
