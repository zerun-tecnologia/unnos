import { CommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
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
    
    const statusMessage = isConnected 
      ? '✅ Banco de dados conectado e funcionando!'
      : `❌ Banco de dados desconectado. Tentativas de reconexão: ${status.attempts}/5`
    
    const fullStatusMessage = `${statusMessage}\n🕐 **Uptime do bot:** ${uptime}`
    
    await interaction.editReply({
      content: fullStatusMessage
    })
  }
}
