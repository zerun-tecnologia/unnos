import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  type CacheType,
} from 'discord.js'
import { prisma } from '../db'

export default {
  data: new SlashCommandBuilder()
    .setName('nova')
    .setDescription('Registra uma partida')
    .addStringOption((option) =>
      option.setName('nome').setDescription('Nome da partida'),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      const nome = interaction.options.getString('nome')
      const guild = interaction.guild

      if (!guild) {
        await interaction.reply({
          content: 'Não foi possível registrar a vitória.',
          ephemeral: true,
        })
        return
      }

      await prisma.match.create({
        data: {
          name: nome,
          guildId: guild.id,
          status: 'open',
        },
      })

      const lastedOpenMatch = await prisma.match.findFirst({
        where: {
          guildId: guild.id,
          status: 'open',
        },
      })

      if (lastedOpenMatch) {
        await prisma.match.update({
          where: {
            id: lastedOpenMatch.id,
          },
          data: {
            status: 'closed',
          },
        })
      }

      await interaction.reply({
        content: 'Partida registrada com sucesso!',
        ephemeral: true,
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível registrar a vitória.',
        ephemeral: true,
      })
    }
  },
}
