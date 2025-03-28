import NextAuth from 'next-auth'
import Discord from 'next-auth/providers/discord'

declare module 'next-auth' {
  interface DefaultSession {
    accessToken: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Discord({
      name: 'discord',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
})
