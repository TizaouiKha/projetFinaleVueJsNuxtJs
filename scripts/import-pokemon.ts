import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL n'est pas défini. Vérifie ton fichier .env ou la variable d'environnement.")
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🚀 Début de l'import...")

  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=2000"
  )

  if (!response.ok) {
    throw new Error("Impossible de récupérer les Pokémon")
  }

  const data = await response.json()

  for (const [index, pokemon] of data.results.entries()) {
    const existing = await prisma.pokemon.findUnique({
      where: {
        name: pokemon.name,
      },
    })

    if (existing) {
      console.log(`⏭️ ${pokemon.name} existe déjà`)
      continue
    }

    const details = await pokemonDetails(pokemon.name)

    await prisma.pokemon.create({
      data: {
        id: index + 1,
        name: details.name,
        image: details.image,
        height: details.height,
        weight: details.weight,
        types: details.types,
      },
    })

    console.log(`✅ ${pokemon.name} importé`)
  }

  console.log("🎉 Import terminé !")
}

async function pokemonDetails(pokemonName: string) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  )

  if (!response.ok) {
    throw new Error(`Impossible de récupérer les détails pour ${pokemonName}`)
  }

  const details = await response.json()

  return {
    id: details.id,
    name: details.name,
    height: details.height,
    weight: details.weight,
    image:
      details.sprites.other.showdown.front_default ??
      details.sprites.front_default ??
      null,
    types: details.types
      .map((t: any) => t?.type?.name)
      .filter((t: unknown): t is string => typeof t === "string"),
  }
}

main()
  .catch((error) => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })