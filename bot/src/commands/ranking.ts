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
    .setName('ranking')
    .setDescription('Mostra o ranking de usuários')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Usuário que deseja ver o ranking')
        .setRequired(false),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    unauthorizedMiddleware(interaction)

    try {
      const user = interaction.options.getUser('user')
      const guild = interaction.guild

      if (!guild) {
        await interaction.reply({
          content: 'Não foi possível ver o ranking.',
          flags: [MessageFlags.Ephemeral],
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
            flags: [MessageFlags.Ephemeral],
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
              some: { userId: user.id },
            },
          },
        })

        await interaction.reply({
          embeds: [
            {
              title: `Ranking de ${user.username}`,
              color: 0x0099ff,
              fields: [
                {
                  name: 'Vitórias',
                  value: wins.length.toString(),
                  inline: true,
                },
                {
                  name: 'Dadas',
                  value: gaves.length.toString(),
                  inline: true,
                },
                {
                  name: 'Bans',
                  value: bans.length.toString(),
                  inline: true,
                },
              ],
            },
          ],
          flags: [MessageFlags.Ephemeral],
        })

        return
      }

      const ranking = await prisma.user.findMany({
        where: {
          guilds: {
            some: {
              id: guild.id,
            },
          },
        },
        select: {
          username: true,
          matches_winner: {
            select: {
              id: true,
            },
          },
          matches_banned: {
            select: {
              userId: true,
            },
          },
          matches_gave: {
            select: {
              id: true,
            },
          },
        },
      })

      await interaction.reply({
        embeds: [
          {
            title: 'Ranking de usuários',
            color: 0x0099ff,
            description: 'Vitórias | Dadas | Bans',
            fields: ranking
              .filter((user) => {
                return (
                  user.matches_winner.length > 0 ||
                  user.matches_gave.length > 0 ||
                  user.matches_banned.length > 0
                )
              })
              .map((user) => {
                return {
                  name: user.username,
                  value: `${String(user.matches_winner.length).padEnd(3, '')} | ${String(user.matches_gave.length).padEnd(3, '')} | ${String(user.matches_banned.length).padEnd(3, '')}`,
                  inline: false,
                }
              }),
          },
        ],
        flags: [MessageFlags.Ephemeral],
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível registrar a vitória.',
      })
    }
  },
}
