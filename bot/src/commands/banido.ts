import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  type CacheType,
} from 'discord.js'
import { prisma } from '../db'

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
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      const user = interaction.options.getUser('user')
      const guild = interaction.guild

      if (!guild || !user) {
        await interaction.reply({
          content: 'Não foi possível registrar o banido.',
          flags: [
            MessageFlags.Ephemeral
          ],
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
            'É necessário iniciar uma partida antes de registrar um banido.',
          flags: [
            MessageFlags.Ephemeral
          ],
        })
        return
      }

      const ids = [...latestMatch.gave.map((user) => user.id),latestMatch.winner?.id]
      
      if (ids.includes(user.id)) {
        await interaction.reply({
          content: 'Este usuário deu ou ganhou a partida.',
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
          },
        }),
        await tx.match.update({
          where: {
            id: latestMatch.id,
          },
          data: {
            banned: {
              connect: {
                id: user.id,
              } 
            }
          }
        })
      ]))
      await interaction.reply({
        content: 'Banido registrado com sucesso!',
        flags: [
          MessageFlags.Ephemeral
        ]
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível registrar quem deu a partida.',
        flags: [
            MessageFlags.Ephemeral
          ],
      })
    }
  },
}
