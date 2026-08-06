import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as {
  prisma?: PrismaClient
}

const dbUrl = process.env.DATABASE_URL
let prismaOptions: any = {}
if (dbUrl) {
  const adapter = new PrismaPg({ connectionString: dbUrl })
  prismaOptions = { adapter }
} else {
  console.warn(
    "DATABASE_URL not set — PrismaClient requires a driver adapter. Set DATABASE_URL or pass an accelerateUrl to PrismaClient."
  )
}

const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaOptions)

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma