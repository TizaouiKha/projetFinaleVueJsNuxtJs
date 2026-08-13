export default defineEventHandler(async () => {
    const teams = await prisma.team.findMany({
        orderBy: {
            createdAt: 'asc',
        },
    });

    return Promise.all(
        teams.map(async (team) => {
            const pokemons = await prisma.pokemon.findMany({
                where: {
                    name: {
                        in: team.pokemons,
                    },
                },
            });

            return {
                ...team,
                pokemons,
            };
        })
    );
});