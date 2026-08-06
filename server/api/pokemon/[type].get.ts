import { getRouterParam } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')

  const pokemons = await prisma.pokemon.findMany({
    where: type
      ? {
          types: {
            has: type,
          },
        }
      : undefined,
    orderBy: {
      name: 'asc',
    },
  })

  return pokemons
})