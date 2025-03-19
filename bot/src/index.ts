import 'dotenv/config'

import { env } from 'bun'
import { Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js'
import './rest'
import { prisma } from './db'
import { commands } from './commands'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
})

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`)
})

client.on(Events.GuildAvailable, async (guild) => {
  const data = {
    id: guild.id,
    name: guild.name,
  }

  const guildCreated = await prisma.guild.upsert({
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

  
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = commands.get(interaction.commandName)

  if (!command) {
    console.error(`Nenhuma função encontrada para o comando ${interaction.commandName}`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
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
})

client.login(env.TOKEN)
