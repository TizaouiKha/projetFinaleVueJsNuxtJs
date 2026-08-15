import { getRouterParam } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  if (!name) return null

  const pokemon = await prisma.pokemon.findFirst({
    where: {
      name: { equals: String(name), mode: 'insensitive' },
    },
  })

  return pokemon
})
