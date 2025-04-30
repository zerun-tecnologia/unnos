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
    .setName('finaliza')
    .setDescription('Finaliza uma partida')
    .addStringOption((option) =>
      option.setName('nome').setDescription('Nome da partida'),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    unauthorizedMiddleware(interaction)

    try {
      const editor = interaction.user
      const guild = interaction.guild

      if (!guild) {
        await interaction.reply({
          content: 'Não foi possível finalizar a partida.',
        })
        return
      }

      const latestOpenMatch = await prisma.match.findFirst({
        where: {
          guildId: guild.id,
          OR: [
            {
              status: 'open',
              editorId: editor.id
            },
            {
              createdAt: {
                lt: new Date(Date.now() - 10 * 60 * 1000) // 30 minutes ago
              }
            }
          ]
        },
        select: {
          id: true,
          editor: true
        }
      })

      if (!latestOpenMatch) {
        await interaction.reply({
          content: 'Não há partidas abertas.',
        })
        return
      }

      if (editor.id != latestOpenMatch.editor?.id) {
        await interaction.reply({
          content: "Você deve ser o editor dessa partida para conseguir alterar as informações",
          flags: [MessageFlags.Ephemeral]
        })
        return
      }

      await prisma.$transaction(async (tx) => [
        await interaction.deferReply(),
        await tx.match.update({
          where: {
            id: latestOpenMatch.id,
          },
          data: {
            status: 'closed',
            finishedAt: new Date(),
          },
        }),
        await interaction.editReply({
          content: `Partida #${latestOpenMatch.id} finalizada.`,
        })
      ])

      
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível finalizar a partida.',
      })
    }
  },
}
