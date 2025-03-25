import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  type CacheType,
} from 'discord.js'
import { prisma } from '../db'
import { unauthorizedMiddleware } from '../middleware/unauthorized'

export default {
  data: new SlashCommandBuilder()
    .setName('nova')
    .setDescription('Registra uma partida')
    .addStringOption((option) =>
      option.setName('nome').setDescription('Nome da partida'),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    unauthorizedMiddleware(interaction)

    try {
      const nome = interaction.options.getString('nome')
      const guild = interaction.guild

      if (!guild) {
        await interaction.reply({
          content: 'Não foi possível registrar a partida.',
        })
        return
      }

      const lastedOpenMatch = await prisma.match.findFirst({
        where: {
          guildId: guild.id,
          status: 'open',
        },
      })

      if (lastedOpenMatch) {
        await prisma.match.update({
          where: {
            id: lastedOpenMatch.id,
          },
          data: {
            status: 'closed',
            finishedAt: new Date(),
          },
        })
      }

      const match = await prisma.match.create({
        data: {
          name: nome,
          guildId: guild.id,
          status: 'open',
        },
      })

      await interaction.reply({
        content: `Partida #${match.id} registrada.`,
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível registrar a vitória.',
      })
    }
  },
}
