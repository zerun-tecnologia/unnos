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
              title: `🏆 Ranking de ${user.username}`,
              description: `Estatísticas do jogador **${user.username}**`,
              color: 0x5865F2, // Discord blurple color
              thumbnail: {
                url: user.displayAvatarURL()
              },
              fields: [
                {
                  name: '🥇 Vitórias',
                  value: `\`${wins.length}\``,
                  inline: true,
                },
                {
                  name: '🎁 Dadas',
                  value: `\`${gaves.length}\``,
                  inline: true,
                },
                {
                  name: '🚫 Bans',
                  value: `\`${bans.length}\``,
                  inline: true,
                }
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
            title: '🏆 Ranking de Usuários',
            color: 0x5865F2, // Discord blurple color
            thumbnail: {
              url: interaction.guild.iconURL() || '',
            },
            description: '**Estatísticas dos jogadores**\n🥇 Vitórias | 🎁 Dadas | 🚫 Bans',
            fields: ranking
              .filter((user) => {
                return (
                  user.matches_winner.length > 0 ||
                  user.matches_gave.length > 0 ||
                  user.matches_banned.length > 0
                )
              })
              .sort((a, b) =>
                b.matches_winner.length - a.matches_winner.length
              )
              .map((user, index) => {
                const medal = index === 0 ? '🥇 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : `${index + 1}. `;
                return {
                  name: `${medal}${user.username}`,
                  value: `\`${String(user.matches_winner.length).padEnd(3, ' ')}\` | \`${String(user.matches_gave.length).padEnd(3, ' ')}\` | \`${String(user.matches_banned.length).padEnd(3, ' ')}\``,
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
