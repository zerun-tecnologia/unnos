import { CommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { checkDatabaseConnection, getDatabaseStatus } from '../db'
import { getBotUptime } from '../index'

export default {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Verifica o status da conexão com o banco de dados e uptime do bot'),
  
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] })
    
    const isConnected = await checkDatabaseConnection()
    const status = getDatabaseStatus()
    const uptime = getBotUptime()
    
    // Create embed
    const embed = new EmbedBuilder()
      .setTitle('🤖 Status do Bot')
      .setColor(isConnected ? 0x00ff00 : 0xff0000) // Green if connected, red if not
      .setTimestamp()
    
    // Database status field
    const dbStatusText = isConnected 
      ? '✅ Conectado e funcionando'
      : `❌ Desconectado\nTentativas de reconexão: ${status.attempts}/5`
    
    embed.addFields(
      {
        name: '🗄️ Banco de Dados',
        value: dbStatusText,
        inline: true
      },
      {
        name: '🕐 Uptime',
        value: uptime,
        inline: true
      }
    )
    
    // Add footer with additional info
    embed.setFooter({
      text: `Status verificado em ${new Date().toLocaleString('pt-BR')}`
    })
    
    await interaction.editReply({
      embeds: [embed]
    })
  }
}
