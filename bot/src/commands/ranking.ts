import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  type CacheType,
} from 'discord.js'
import { prisma } from '../db'

export default {
  data: new SlashCommandBuilder()
    .setName('ranking')
    .setDescription('Mostra o ranking de usuários')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Usuário que deseja ver o ranking')
        .setRequired(true),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      const user = interaction.options.getUser('user')
      const guild = interaction.guild

      if (!guild) {
        await interaction.reply({
          content: 'Não foi possível ver o ranking.',
          ephemeral: true,
        })
        return
      }

      if (user) {
        const userRanking = await prisma.user.findFirst({
          where: {
            id: user.id,
          },
        })

        if (!userRanking) {
          await interaction.reply({
            content: 'Usuário não encontrado.',
            ephemeral: true,
          })
          return
        }

        const wins = await prisma.match.findMany({
          where: {
            winnerId: user.id,
          },
        })

        const gaves = await prisma.match.findMany({
          where: {
            gave: {
              some: {
                id: user.id,
              },
            },
          },
        })

        const bans = await prisma.match.findMany({
          where: {
            banned: {
              some: { id: user.id },
            },
          },
        })

        const rankingMessage = `
        **Ranking de ${user.username}**
        **Vitórias:** ${wins.length}
        **Derrotas:** ${gaves.length}
        **Bans:** ${bans.length}
        `

        await interaction.reply({
          content: rankingMessage,
          ephemeral: true,
        })
      }
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível registrar a vitória.',
        ephemeral: true,
      })
    }
  },
}
