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
    .setName('banido')
    .setDescription('Registra um banido')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Usuário que foi banido')
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName('cards')
        .setDescription('Número de cartas')
        .setRequired(false),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    unauthorizedMiddleware(interaction)

    try {
      const user = interaction.options.getUser('user')
      const guild = interaction.guild

      if (!guild || !user) {
        await interaction.reply({
          content: 'Não foi possível registrar o banido.',
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
          gave: true,
        },
      })

      if (!latestMatch) {
        await interaction.reply({
          content:
            'É necessário iniciar uma partida antes de registrar um banido.',
        })
        return
      }

      const ids = [
        ...latestMatch.gave.map((user) => user.id),
        latestMatch.winner?.id,
      ]

      if (ids.includes(user.id)) {
        await interaction.reply({
          content: `${user.username} já deu ou ganhou a partida #${latestMatch.id}.`,
        })
        return
      }

      await prisma.$transaction(async (tx) => [
        await tx.user.upsert({
          where: {
            id: user.id,
          },
          update: {
            username: user.username,
            id: user.id,
            guilds: {
              connect: {
                id: guild.id,
              },
            },
          },
          create: {
            username: user.username,
            id: user.id,
            guilds: {
              connect: {
                id: guild.id,
              },
            },
          },
        }),
        await tx.match.update({
          where: {
            id: latestMatch.id,
          },
          data: {
            banned: {
              create: {
                userId: user.id,
                count: interaction.options.getInteger('cards') || 0,
              },
            },
          },
        }),
      ])
      await interaction.reply({
        content: `${user.username} foi banido da partida #${latestMatch.id}.`,
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível registrar o banido.',
      })
    }
  },
}
