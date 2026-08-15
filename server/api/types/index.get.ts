import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
  const types = await prisma.types.findMany()

  return types
})