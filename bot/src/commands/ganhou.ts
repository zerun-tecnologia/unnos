import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  type CacheType,
} from 'discord.js'
import { prisma } from '../db'

export default {
  data: new SlashCommandBuilder()
    .setName('ganhou')
    .setDescription('Registra uma vitória')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Usuário a ser registrado')
        .setRequired(true),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      const user = interaction.options.getUser('user')
      const guild = interaction.guild

      if (!guild || !user) {
        await interaction.reply({
          content: 'Não foi possível registrar a vitória.',
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
          banned: true,
          gave: true,
        },
      })

      if (!latestMatch) {
        await interaction.reply({
          content:
            'É necessário iniciar uma partida antes de registrar uma vitória.',
        })
        return
      }

      const ids = [
        ...latestMatch.banned.map((user) => user.userId),
        ...latestMatch.gave.map((user) => user.id),
      ]

      if (ids.includes(user.id)) {
        await interaction.reply({
          content: `${user.username} foi banido ou deu a partida #${latestMatch.id}.`,
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
            winnerId: user.id,
          },
        }),
      ])

      await interaction.reply({
        content: `${user.username} venceu a partida #${latestMatch.id}.`,
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível registrar a vitória.',
      })
    }
  },
}
