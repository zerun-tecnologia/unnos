import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator'

export function matchNameGenerator() {
  return uniqueNamesGenerator({
    dictionaries: [
      adjectives,
      colors,
      animals,
    ],
  })
}
