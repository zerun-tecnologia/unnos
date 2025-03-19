import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  type CacheType,
} from 'discord.js'
import { prisma } from '../db'

export default {
  data: new SlashCommandBuilder()
    .setName('limpar')
    .setDescription('Limpar dados da partida')
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
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
          winner: true,
          gave: true
        }
      })

      if (!latestMatch) {
        await interaction.reply({
          content:
            'É necessário iniciar uma partida antes de limpar os dados.',
      
        })
        return
      }

      await prisma.$transaction(async (tx) => ([
      
        await tx.match.update({
          where: {
            id: latestMatch.id,
          },
          data: {
            banned: {
              deleteMany: {}
            },
            gave: {
              deleteMany: {}
            },
            winner: {
              disconnect: true
            }
          }
        })
      ]))
      await interaction.reply({
        content: 'Dados da partida limpos com sucesso!',
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível limpar a partida.',
      })
    }
  },
}
