import {
  ChatInputCommandInteraction,
  MessageFlags,
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
          content: 'Não foi possível registrar a partida.',
          flags: [
            MessageFlags.Ephemeral
          ],
        })
        return
      }

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

      await prisma.match.create({
        data: {
          name: nome,
          guildId: guild.id,
          status: 'open',
        },
      })

      await interaction.reply({
        content: 'Partida registrada com sucesso!',
        flags: [
            MessageFlags.Ephemeral
          ],
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível registrar a vitória.',
        flags: [
            MessageFlags.Ephemeral
          ],
      })
    }
  },
}
