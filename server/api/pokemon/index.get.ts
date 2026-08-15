

import { getQuery } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const rawLimit = Array.isArray(q.limit) ? q.limit[0] : q.limit
  const rawOffset = Array.isArray(q.offset) ? q.offset[0] : q.offset
  const type = Array.isArray(q.type) ? q.type[0] : q.type
  const rawSearch = Array.isArray(q.search) ? q.search[0] : q.search

  const limit = Number.isFinite(Number(rawLimit)) ? Math.max(1, Math.min(100, parseInt(String(rawLimit), 10))) : 20
  const offset = Number.isFinite(Number(rawOffset)) ? Math.max(0, parseInt(String(rawOffset), 10)) : 0

  const search = rawSearch ? String(rawSearch).trim() : undefined

  const nameSearch = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { nameFr: { contains: search, mode: 'insensitive' } },
        ],
      }
    : undefined

  let where: any = undefined
  if (type && search) {
    where = {
      AND: [
        { types: { has: String(type) } },
        nameSearch,
      ],
    }
  } else if (type) {
    where = { types: { has: String(type) } }
  } else if (search) {
    where = nameSearch
  }

  const [data, total] = await Promise.all([
    prisma.pokemon.findMany({
      where,
      take: limit,
      skip: offset,
    }),
    prisma.pokemon.count({ where }),
  ])

  return {
    data,
    total,
    limit,
    offset,
  }
})