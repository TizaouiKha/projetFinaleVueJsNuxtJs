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
    "https://pokeapi.co/api/v2/type"
  )

  if (!response.ok) {
    throw new Error("Impossible de récupérer les Pokémon")
  }

  const data = await response.json()
  for (const type of data.results) {
    const existing = await prisma.types.findFirst({
      where: {
        name: type.name,
      },
    })

    if (existing) {
      console.log(`⏭️ ${type.name} existe déjà`)
      continue
    }

    const index = data.results.indexOf(type) + 1

    await prisma.types.create({
      data: {
        name: type.name,
        number: parseInt(index.toString(), 10),
      },
    })

    console.log(`✅ ${type.name} importé`)
  }

  console.log("🎉 Import terminé !")
}

main()
  .catch((error) => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })