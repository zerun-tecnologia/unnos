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
    .setName('partida')
    .setDescription('Mostra os detalhes da partida')
    .addNumberOption((option) =>
      option
        .setName('partida')
        .setDescription('Número da partida que deseja ver os detalhes')
        .setRequired(true),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    unauthorizedMiddleware(interaction)

    try {
      const matchId = interaction.options.getNumber('partida')
      const guild = interaction.guild

      if (!guild) {
        await interaction.reply({
          content: 'Não foi possível ver os detalhes da partida.',
          flags: [MessageFlags.Ephemeral],
        })
        return
      }

      if (!matchId) {
        await interaction.reply({
          content: 'Por favor, forneça um ID de partida válido.',
          flags: [MessageFlags.Ephemeral],
        })
        return
      }

      const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })

      const match = await prisma.match.findFirstOrThrow({
        where: {
          guildId: guild.id,
          id: matchId,
        },
        include: {
          participants: true,
          banned: true,
          winner: true,
          gave: true,
          editor: true,
          season: true,
        },
      })


      await interaction.reply({
        embeds: [
          {
            title: `🏆 Partida #${match.id}`,
            color: 0x5865F2, // Discord blurple color
            thumbnail: {
              url: interaction.guild.iconURL() || '',
            },
            fields: [
              {
                name: '🥇 Vencedor',
                value: match.winner ? match.winner.username : '~',
                inline: true,
              },
              {
                name: '📝 Editor',
                value: match.editor?.username ?? '~',
                inline: true,
              },
              {
                name: '🌱 Temporada',
                value: match.season ? match.season.name : '~',
                inline: true,
              },
              {
                name: '🚫 Banidos',
                value: match.banned.length
                  ? match.banned.map(u => `\`${u.username}\``).join(', ')
                  : '~',
                inline: false,
              },
              {
                name: '🎁 Deram',
                value: match.gave.length
                  ? match.gave.map(u => `\`${u.username}\``).join(', ')
                  : '~',
                inline: false,
              },
              {
                name: '👥 Participantes',
                value: match.participants.length
                  ? match.participants.map(u => `\`${u.username}\``).join(', ')
                  : '~',
                inline: false,
              },
            ],
            footer: {
              text: `ID da partida: ${match.id}`,
            },
            timestamp: match.createdAt.toISOString(),
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
