import * as fs from 'node:fs'
import * as path from 'node:path'

const foldersPath = path.join(__dirname, 'menus')
const menuFiles = fs.readdirSync(foldersPath)

export const menus = new Map()

for await (const file of menuFiles) {
  const menu = (await import(path.join(foldersPath, file))).default

  if ('name' in menu && 'execute' in menu) {
    menus.set(menu.name, menu)
  } else {
    console.log(
      `[WARNING] The menu at ${file} is missing a required "name" or "execute" property.`,
    )
  }
}
