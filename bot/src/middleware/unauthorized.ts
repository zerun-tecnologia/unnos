import type { CacheType, ChatInputCommandInteraction, UserSelectMenuInteraction } from 'discord.js'

const bannedUsers: Array<string> = []

export function unauthorizedMiddleware(
  interaction: ChatInputCommandInteraction<CacheType> | UserSelectMenuInteraction<CacheType>,
) {
  if (bannedUsers.includes(interaction.user.id)) {
    interaction.reply({
      content: 'Você não tem permissão para executar esse comando.',
      ephemeral: true,
    })
    return
  }
}
