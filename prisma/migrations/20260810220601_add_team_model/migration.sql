-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "pokemons" TEXT[],

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);
