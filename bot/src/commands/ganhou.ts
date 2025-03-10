import {
  ChatInputCommandInteraction,
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
          ephemeral: true,
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
            'É necessário iniciar uma partida antes de registrar uma vitória.',
          ephemeral: true,
        })
        return
      }

      await prisma.match.update({
        where: {
          id: latestMatch.id,
        },
        data: {
          winnerId: user.id,
        },
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
