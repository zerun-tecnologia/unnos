import {
  UserSelectMenuInteraction,
  type CacheType
} from 'discord.js'
import { prisma } from '../db'
import { unauthorizedMiddleware } from '../middleware/unauthorized'

export default {
  name: 'participantes',
  async execute(interaction: UserSelectMenuInteraction<CacheType>) {
    unauthorizedMiddleware(interaction)

    try {
      const editor = interaction.user
      const guild = interaction.guild
      const menuId = interaction.customId
      const selectedUsers = interaction.users

      if (!guild) {
        await interaction.reply({
          content: 'Não foi possível encontrar a guilda.',
        })
        return
      }

      if (!menuId) {
        await interaction.reply({
          content: 'Não foi possível encontrar o menu associado a esta interação.',
        })
        return
      }

      const latestMatch = await prisma.match.findFirst({
        where: {
          guildId: guild.id,
          menuId: menuId,
          status: 'open',
          editorId: editor.id,
        },
        select: {
          id: true,
        },
      })

      if (!latestMatch) {
        await interaction.reply({
          content: 'Não foi possível encontrar a partida associada a este menu.',
        })
        return
      }

      const existingUsers = await prisma.user.findMany({
        where: {
          id: {
            in: selectedUsers.map(user => user.id),
          },
          guilds: {
            some: {
              id: guild.id,
            },
          },
        },
        select: {
          id: true,
        }
      })

      if (existingUsers.length === 0) {
        await interaction.reply({
          content: 'Nenhum usuário selecionado é válido ou pertence a esta guilda.',
        })
        return
      }

      await prisma.$transaction(async (tx) => {
        await tx.match.update({
          where: {
            id: latestMatch.id,
          },
          data: {
            participants: {
              connect: existingUsers.map(user => ({ id: user.id })),
            },
          },
        })

        return [
          await interaction.reply({
            content: `Participantes atualizados com sucesso!`,
          })
        ]
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível atualizar os participantes da partida.',
      })
    }
  },
}
