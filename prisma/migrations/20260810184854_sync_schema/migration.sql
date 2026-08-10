/*
  Warnings:

  - The primary key for the `Pokemon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Pokemon` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Pokemon" DROP CONSTRAINT "Pokemon_pkey",
ADD COLUMN     "cry" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "types" TEXT[],
ADD COLUMN     "weight" INTEGER,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ALTER COLUMN "image" DROP NOT NULL,
ADD CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "Types_pkey" PRIMARY KEY ("id")
);
