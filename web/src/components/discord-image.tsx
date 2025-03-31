import type { ImageProps } from 'next/image'

import Image from 'next/image'

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  guild: DiscordGuild
}

export function DiscordImage({ guild, ...props }: Props) {
  return <Image {...props} src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={guild.name} />
}
