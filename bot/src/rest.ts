import { REST, Routes } from 'discord.js'

import { commands } from './commands'
import { env } from './env'

const rest = new REST().setToken(env.TOKEN)

try {
  console.log('Started refreshing application (/) commands.')

  const body = Array.from(commands.values()).map((command) => command.data)

  await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
    body,
  })

  console.log('Successfully reloaded application (/) commands.')
} catch (error) {
  console.error(error)
}
