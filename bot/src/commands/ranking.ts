import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  type CacheType,
} from 'discord.js'
import { prisma } from '../db'
import { unauthorizedMiddleware } from '../middleware/unauthorized'
import { getSeasonStatsWithAggregation } from '../aggregation'

export default {
  data: new SlashCommandBuilder()
    .setName('ranking')
    .setDescription('Mostra o ranking de usuários')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Usuário que deseja ver o ranking')
        .setRequired(false),
    ).addNumberOption((option) =>
      option
        .setName('season')
        .setDescription('Temporada que deseja ver o ranking')
        .setRequired(false),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    unauthorizedMiddleware(interaction)

    try {
      const user = interaction.options.getUser('user')
      const seasonID = interaction.options.getNumber('season')
      const guild = interaction.guild

      if (!guild) {
        await interaction.reply({
          content: 'Não foi possível ver o ranking.',
          flags: [MessageFlags.Ephemeral],
        })
        return
      }

      const season = seasonID ? await prisma.season.findFirstOrThrow({
        where: {
          name: seasonID.toString(),
          guildId: guild.id,
        },
      }) : await prisma.season.findFirstOrThrow({
        where: {
          guildId: guild.id,
          startAt: {
            lte: new Date(),
          },
          endAt: {
            gte: new Date(),
          },
        },
      })

      const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })

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
            season: season
          },
        })

        const gaves = await prisma.match.findMany({
          where: {
            season: season,
            gave: {
              some: {
                id: user.id,
              },
            },
          },
        })

        const bans = await prisma.match.findMany({
          where: {
            season: season,
            banned: {
              some: { id: user.id },
            },
          },
        })

        await interaction.reply({
          embeds: [
            {
              title: `🏆 Ranking de ${user.username} - Temporada ${season?.name}`,
              description: `Inicio: ${dateFormatter.format(season.startAt)} | Fim: ${dateFormatter.format(season.endAt)}\n
              **Estatísticas do jogador ${user.username}**`,
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
                },
              ],
            },
          ],
          flags: [MessageFlags.Ephemeral],
        })

        return
      }

      const ranking = await getSeasonStatsWithAggregation(guild.id, season.id)

      const totalMatches = await prisma.match.count({
        where: {
          guildId: guild.id,
          seasonId: season.id
        }
      })

      const sortedRanking = ranking
        .filter((user) => {
          return (
            user.winner > 0 ||
            user.gave > 0 ||
            user.banned > 0
          )
        })
        .map(user => ({
          ...user,
          coefficient: (user.winner * 2) / (user.gave + user.banned || 1) // Avoid division by zero
        }))
        .sort((a, b) => {
          // First sort by number of wins
          const winDiff = b.winner - a.winner;
          if (winDiff !== 0) return winDiff;

          // If wins are equal, sort by coefficient
          return b.coefficient - a.coefficient;
        })

      await interaction.reply({
        embeds: [
          {
            title: `🏆 Ranking de Usuários - Temporada ${season?.name}`,
            color: 0x5865F2, // Discord blurple color
            thumbnail: {
              url: interaction.guild.iconURL() || '',
            },
            description: `Inicio: ${dateFormatter.format(season.startAt)} | Fim: ${dateFormatter.format(season.endAt)} | Partidas: ${totalMatches}\n
              **Estatísticas dos jogadores**\n🥇 Vitórias | 🎁 Dadas | 🚫 Bans`,
            fields: sortedRanking
              .map((user, index) => {
                const medal = index === 0 ? '🥇 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : `${index + 1}. `;
                return {
                  name: `${medal}${user.username}`,
                  value: `\`${String(user.winner).padEnd(4, ' ')}\` | \`${String(user.gave).padEnd(4, ' ')}\` | \`${String(user.banned).padEnd(4, ' ')}\``,
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
        content: 'Não foi possível ver o ranking.',
        flags: [MessageFlags.Ephemeral],
      })
    }
  },
}
