import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  type CacheType,
} from 'discord.js'
import { prisma } from '../db'

export default {
  data: new SlashCommandBuilder()
    .setName('participantes')
    .setDescription('Registra os participantes da partida')
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      const guild = interaction.guild

      if (!guild) {
        await interaction.reply({
          content: 'Não foi possível registrar os participantes.',
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
      })

      if (!latestMatch) {
        await interaction.reply({
          content:
            'É necessário iniciar uma partida antes de registrar os participantes.',
          flags: [
            MessageFlags.Ephemeral
          ],
        })
        return
      }

      await interaction.reply({
        content: 'Participantes registrados com sucesso!',
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Não foi possível registrar os participantes.',
        flags: [
            MessageFlags.Ephemeral
          ],
      })
    }
  },
}
