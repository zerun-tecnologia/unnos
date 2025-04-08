import type { CacheType, ChatInputCommandInteraction } from 'discord.js'

const bannedUsers: Array<string> = []

export function unauthorizedMiddleware(
  interaction: ChatInputCommandInteraction<CacheType>,
) {
  if (bannedUsers.includes(interaction.user.id)) {
    interaction.reply({
      content: 'Você não tem permissão para executar esse comando.',
      ephemeral: true,
    })
    return
  }
}
