import type { CacheType, ChatInputCommandInteraction } from 'discord.js'

const bannedUsers = ['357015751057735682', '765572736214761512']

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
