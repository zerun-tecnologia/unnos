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
      const editor = interaction.user
      const nome = interaction.options.getString('nome')
      const guild = interaction.guild

      if (!guild) {
        await interaction.reply({
          content: 'Não foi possível registrar a partida.',
        })
        return
      }


      await prisma.$transaction(async (tx) => {
        await interaction.deferReply(),
        await tx.match.updateMany({
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
          data: {
            status: 'closed',
            finishedAt: new Date(),
          },
        })
  
        const match = await tx.match.create({
          data: {
            name: nome,
            guildId: guild.id,
            status: 'open',
          },
        })
        
        return [
          await interaction.editReply({
            content: `Partida #${match.id} registrada.`,
          })
        ]
      })

      
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível registrar a vitória.',
      })
    }
  },
}
