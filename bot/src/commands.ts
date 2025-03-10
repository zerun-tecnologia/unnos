import * as fs from 'node:fs'
import * as path from 'node:path'

const foldersPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(foldersPath)

// COMMANDS
// /ganhou @username
// /deu @username
// /banido @username quantidade
// /ranking
// /ranking @username
// /nova id_partida? (editado)
// /finaliza
// /detalhe id_partida (editado)
// /lista page?

export const commands = new Map()

for await (const file of commandFiles) {
  const command = (await import(path.join(foldersPath, file))).default

  if ('data' in command && 'execute' in command) {
    commands.set(command.data.name, command)
  } else {
    console.log(
      `[WARNING] The command at ${file} is missing a required "data" or "execute" property.`,
    )
  }
}
