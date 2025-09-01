import 'dotenv/config'

import { env } from 'bun'
import { Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js'
import DiscordEventHandler from 'discordjs-logger'
import { commands } from './commands'
import { prisma, checkDatabaseConnection, getDatabaseStatus } from './db'
import { menus } from './menus'
import { checkDatabaseMiddleware } from './middleware/database-check'
import './rest'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
})

const logger = new DiscordEventHandler(client);

logger.registerEvents([
  [Events.InteractionCreate,(interaction: any) => {
    console.log(`Mensagem de interação criada: ${interaction.id} | ${interaction.commandName} - ${interaction.guild?.name} | ${interaction.user.username} `)
  }]
])

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`)
})

client.on(Events.GuildAvailable, async (guild) => {
  // Verificar conexão com banco antes de processar
  const isConnected = await checkDatabaseConnection()
  if (!isConnected) {
    console.error(`❌ Não foi possível processar guild ${guild.name} - banco desconectado`)
    return
  }

  try {
    const data = {
      id: guild.id,
      name: guild.name,
    }

    await prisma.guild.upsert({
      where: { id: guild.id },
      update: data,
      create: data,
    })

    const users = await guild.members.list()

    for (const {"1": user} of users) {
      await prisma.user.upsert({
        where: {
          id: user.id
        },
        create: {
          id: user.id,
          username: user.user.username,
          guilds: {
            connect:{ id: guild.id}
          }
        },
        update: {
          username: user.user.username,
          guilds: {
            connect: { id: guild.id }
          }
        }
      })
    }
  } catch (error) {
    console.error(`❌ Erro ao processar guild ${guild.name}:`, error)
    // Tentar verificar se é um erro de conexão
    await checkDatabaseConnection()
  }
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isUserSelectMenu()) {
    try {
      // Verificar conexão com banco antes de processar menu
      const canProceed = await checkDatabaseMiddleware(interaction as any)
      if (!canProceed) return

      await menus.get('participantes')?.execute(interaction)
    } catch (error) {
      console.error(error)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'Ocorreu um erro ao processar a seleção de usuários!',
          flags: MessageFlags.Ephemeral,
        })
      } else {
        await interaction.reply({
          content: 'Ocorreu um erro ao processar a seleção de usuários!',
          flags: MessageFlags.Ephemeral,
        })
      }
    } finally {
      return
    }
  }

  if (!interaction.isChatInputCommand()) return

  // Verificar conexão com banco antes de processar comando
  const canProceed = await checkDatabaseMiddleware(interaction)
  if (!canProceed) return

  const command = commands.get(interaction.type == 2 ? interaction.commandName : 'participantes')

  if (!command) {
    console.error(`Nenhuma função encontrada para o comando ${interaction.commandName}`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    
    // Verificar se o erro pode ser relacionado à conexão com banco
    const dbStatus = getDatabaseStatus()
    if (!dbStatus.connected) {
      const errorMessage = '❌ Erro de conexão com banco de dados. Tente novamente em alguns momentos.'
      
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
    } else {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'Ocorreu um erro ao executar este comando!',
          flags: MessageFlags.Ephemeral,
        })
      } else {
        await interaction.reply({
          content: 'Ocorreu um erro ao executar este comando!',
          flags: MessageFlags.Ephemeral,
        })
      }
    }
  }
})
client.login(env.AUTH_DISCORD_TOKEN)
