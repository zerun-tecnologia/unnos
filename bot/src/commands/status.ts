import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { getDatabaseStatus, checkDatabaseConnection } from '../db'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Verifica o status da conexão com o banco de dados'),
  
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true })
    
    const isConnected = await checkDatabaseConnection()
    const status = getDatabaseStatus()
    
    const statusMessage = isConnected 
      ? '✅ Banco de dados conectado e funcionando!'
      : `❌ Banco de dados desconectado. Tentativas de reconexão: ${status.attempts}/5`
    
    await interaction.editReply({
      content: statusMessage
    })
  }
}
