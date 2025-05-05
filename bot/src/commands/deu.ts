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
    .setName('deu')
    .setDescription('Registra quem deu a partida')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Usuário que deu a partida')
        .setRequired(true),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    unauthorizedMiddleware(interaction)

    try {
      const editor = interaction.user
      const user = interaction.options.getUser('user')
      const guild = interaction.guild

      if (!guild || !user) {
        await interaction.reply({
          content: 'Não foi possível registrar quem deu a partida.',
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
          banned: true,
          winner: true,
        },
      })

      if (!latestMatch) {
        await interaction.reply({
          content:
            'É necessário iniciar uma partida antes de registrar quem deu a partida.',
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

      const ids = [
        ...latestMatch.banned.map(user => user.id),
        latestMatch.winner?.id,
      ]

      if (ids.includes(user.id)) {
        await interaction.reply({
          content: `${user.username} já foi banido ou ganhou a partida #${latestMatch.id}.`,
        })
        return
      }

      await prisma.$transaction(async (tx) => [
        await interaction.deferReply(),
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
            gave: {
              connect: {
                id: user.id,
              },
            },
          },
        }),
        await interaction.editReply({
          content: `${user.username} deu a partida #${latestMatch.id}.`,
        })
      ])

     
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível registrar quem deu a partida.',
      })
    }
  },
}
