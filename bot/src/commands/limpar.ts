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
    .setName('limpar')
    .setDescription('Limpar dados da partida')
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    unauthorizedMiddleware(interaction)

    try {
      const editor = interaction.user
      const guild = interaction.guild

      if (!guild) {
        await interaction.reply({
          content: 'Não foi possível limpar a partida.',
        })
        return
      }

      const latestMatch = await prisma.match.findFirst({
        where: {
          guildId: guild.id,
          status: 'open',
        },
        select: {
          id: true,
          editor: true,
          winner: true,
          gave: true,
        },
      })

      if (!latestMatch) {
        await interaction.reply({
          content: 'É necessário iniciar uma partida antes de limpar os dados.',
        })
        return
      }

      if (editor.id != latestMatch.editor?.id) {
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
            id: latestMatch.id,
          },
          data: {
            banned: {
              deleteMany: {},
            },
            gave: {
              deleteMany: {},
            },
            winner: {
              disconnect: true,
            },
          },
        }),
        await interaction.editReply({
          content: `Partida #${latestMatch.id} limpa.`,
        })
      ])
    
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível limpar a partida.',
      })
    }
  },
}
