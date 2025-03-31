import ky from 'ky'

import { auth } from '@/auth'
import { DiscordImage } from '@/components/discord-image'

export default async function GuildsPage() {
  const session = await auth()

  if (!session?.accessToken) {
    return (
      <div>
        <h1>Guilds</h1>
        <p>You are not logged in</p>
      </div>
    )
  }

  const guilds = await ky.get('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  }).json<DiscordGuild[]>()

  return (
    <div className="mt-20">
      <h1>Guilds</h1>
      <div className="grid grid-cols-4 gap-8">
        {guilds.map(guild => (
          <div key={guild.id}>
            <DiscordImage guild={guild} width={100} height={100} className="rounded-full mx-auto" />
            <h2 className="text-center">{guild.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}
