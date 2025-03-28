import NextAuth from 'next-auth'
import Discord from 'next-auth/providers/discord'

declare module 'next-auth' {
  interface Session {
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
  //   callbacks: {
  //     async session({ session, token }) {
  //       session.accessToken = token.access_token
  //       return session
  //     },

//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token
//         console.log(token.accessToken)
//       }
//       return token
//     },
//   },
})
