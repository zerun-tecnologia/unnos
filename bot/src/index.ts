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

  const users = guild.members.cache.map((member) => ({
    id: member.id,
    username: member.user.username,
  }))

  await prisma.guild.upsert({
    where: { id: guild.id },
    update: data,
    create: data,
  })

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  })
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      })
    }
  }
})

client.login(env.TOKEN)
