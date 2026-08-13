import { readBody } from 'h3'
import { ensurePokemonMoves } from '../../utils/movesBackfill'

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as { names?: unknown }

    if (!Array.isArray(body.names) || body.names.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Liste de Pokémon invalide',
        })
    }

    const names = body.names.filter((n): n is string => typeof n === 'string')

    const pokemons = await Promise.all(names.map((name) => ensurePokemonMoves(name)))

    return pokemons.filter(Boolean)
})
