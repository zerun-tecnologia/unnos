import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  type CacheType,
} from 'discord.js'
import { prisma } from '../db'

export default {
  data: new SlashCommandBuilder()
    .setName('finaliza')
    .setDescription('Finaliza uma partida')
    .addStringOption((option) =>
      option.setName('nome').setDescription('Nome da partida'),
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      const guild = interaction.guild

      if (!guild) {
        await interaction.reply({
          content: 'Não foi possível finalizar a partida.',
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

      if (!lastedOpenMatch) {
        await interaction.reply({
          content: 'Não há partidas abertas.',
          flags: [
            MessageFlags.Ephemeral
          ],
        })
        return
      }

      await prisma.match.update({
        where: {
          id: lastedOpenMatch.id,
        },
        data: {
          status: 'closed',
        },
      })

      await interaction.reply({
        content: 'Partida finalizada com sucesso!',
        flags: [
            MessageFlags.Ephemeral
          ],
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível finalizar a partida.',
        flags: [
            MessageFlags.Ephemeral
          ],
      })
    }
  },
}
