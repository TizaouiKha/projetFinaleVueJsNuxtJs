import { readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as { pokemons?: unknown; team?: unknown; name?: unknown }
  const rawTeam = body.pokemons ?? body.team

  if (!Array.isArray(rawTeam) || rawTeam.length === 0) {
    event.node.res.statusCode = 400
    return { error: 'Payload missing team data' }
  }

  const pokemons = rawTeam.map((item) => {
    if (typeof item === 'string') return item
    if (typeof item === 'number') return String(item)
    return null
  })

  if (pokemons.some((pokemon) => pokemon === null)) {
    event.node.res.statusCode = 400
    return { error: 'Each team item must be a string, number, or object with an id' }
  }

  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : null

  const team = await prisma.team.create({
    data: {
      name,
      pokemons: pokemons as string[],
    },
  })

  return {
    success: true,
    team,
  }
})
