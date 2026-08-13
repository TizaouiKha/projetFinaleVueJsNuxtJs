import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
    const teams = await prisma.team.findMany({
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
