-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "moves" JSONB;

-- CreateTable
CREATE TABLE "NpcTeam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "pokemons" TEXT[],

    CONSTRAINT "NpcTeam_pkey" PRIMARY KEY ("id")
);
