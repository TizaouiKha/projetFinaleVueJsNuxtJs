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

const NPC_TEAMS: { name: string; difficulty: "easy" | "medium" | "hard"; pokemons: string[] }[] = [
  { name: "Débutants", difficulty: "easy", pokemons: ["rattata", "pidgey", "caterpie"] },
  { name: "Petits monstres", difficulty: "easy", pokemons: ["magikarp", "zubat", "geodude"] },
  { name: "Dresseur d'arène", difficulty: "medium", pokemons: ["arcanine", "machamp", "alakazam", "gengar"] },
  { name: "Chasseurs de nuit", difficulty: "medium", pokemons: ["houndoom", "absol", "luxray", "gardevoir"] },
  { name: "Élite 4", difficulty: "hard", pokemons: ["dragonite", "tyranitar", "metagross", "garchomp", "salamence"] },
  { name: "Champion", difficulty: "hard", pokemons: ["charizard", "blastoise", "venusaur", "snorlax", "gyarados"] },
]

async function main() {
  console.log("🚀 Seed des équipes NPC...")

  for (const team of NPC_TEAMS) {
    const existing = await prisma.npcTeam.findFirst({ where: { name: team.name } })

    if (existing) {
      console.log(`⏭️ ${team.name} existe déjà`)
      continue
    }

    await prisma.npcTeam.create({ data: team })
    console.log(`✅ ${team.name} (${team.difficulty}) créée`)
  }

  console.log("🎉 Seed terminé !")
}

main()
  .catch((error) => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
