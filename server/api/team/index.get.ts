import prisma from '../../utils/prisma'
import { requireUserId } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const userId = await requireUserId(event)

    const teams = await prisma.team.findMany({
        where: { userId },
        orderBy: {
            createdAt: 'desc',
        },
    })

    const pokemonNames = [...new Set(teams.flatMap((team) => team.pokemons))]

    const pokemons = await prisma.pokemon.findMany({
        where: {
            name: { in: pokemonNames },
        },
    })

    const pokemonByName = new Map(pokemons.map((pokemon) => [pokemon.name, pokemon]))

    return teams.map((team) => ({
        ...team,
        pokemons: team.pokemons
            .map((name) => pokemonByName.get(name))
            .filter((pokemon): pokemon is typeof pokemons[number] => Boolean(pokemon)),
    }))
})
