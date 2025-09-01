import { CommandInteraction, MessageFlags } from 'discord.js'
import { checkDatabaseConnection, getDatabaseStatus } from '../db'

export async function checkDatabaseMiddleware(interaction: CommandInteraction): Promise<boolean> {
  const isConnected = await checkDatabaseConnection()
  
  if (!isConnected) {
    const status = getDatabaseStatus()
    
    const errorMessage = status.attempts > 0 
      ? `🔄 O banco de dados está temporariamente indisponível. Tentando reconectar... (tentativa ${status.attempts}/5)\nTente novamente em alguns momentos.`
      : '❌ Não foi possível conectar ao banco de dados. Tente novamente em alguns momentos.'

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: errorMessage,
        flags: MessageFlags.Ephemeral,
      })
    } else {
      await interaction.reply({
        content: errorMessage,
        flags: MessageFlags.Ephemeral,
      })
    }
    
    return false
  }
  
  return true
}
