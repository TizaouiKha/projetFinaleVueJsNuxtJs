import { getQuery } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const rawCount = Array.isArray(q.count) ? q.count[0] : q.count
  const count = Number.isFinite(Number(rawCount)) ? Math.max(1, Math.min(10, parseInt(String(rawCount), 10))) : 2

  const where = { hp: { not: null } }
  const total = await prisma.pokemon.count({ where })

  const offsets = new Set<number>()
  while (offsets.size < Math.min(count, total)) {
    offsets.add(Math.floor(Math.random() * total))
  }

  const pokemons = await Promise.all(
    Array.from(offsets).map((skip) =>
      prisma.pokemon.findFirst({ where, orderBy: { id: 'asc' }, skip })
    )
  )

  return pokemons.filter(Boolean)
})
