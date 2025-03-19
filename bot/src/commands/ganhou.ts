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
          flags: [
            MessageFlags.Ephemeral
          ]
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
          gave: true
        }
      })

      if (!latestMatch) {
        await interaction.reply({
          content:
            'É necessário iniciar uma partida antes de registrar uma vitória.',
            flags: [
              MessageFlags.Ephemeral
            ]
        })
        return
      }

      const ids = [...latestMatch.banned.map((user) => user.id), ...latestMatch.gave.map((user) => user.id)]

      if (ids.includes(user.id)) {
        await interaction.reply({
          content: 'Este usuário foi banido ou deu a partida.',
          flags: [
            MessageFlags.Ephemeral
          ]          
        })
        return
      }

      await prisma.$transaction(async (tx) => ([
        await tx.user.upsert({
          where: {
            id: user.id,
          },
          update: {
            username: user.username,
            id: user.id,
            
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
          }
        })
      ]))

      await interaction.reply({
        content: 'Vitória registrada com sucesso!',
        flags: [
          MessageFlags.Ephemeral
        ]
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível registrar a vitória.',
        flags: [
          MessageFlags.Ephemeral
        ]
      })
    }
  },
}
