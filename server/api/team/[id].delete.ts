import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'));

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID invalide',
        });
    }

    const existing = await prisma.team.findUnique({
        where: {
            id,
        },
    });

    if (!existing) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Équipe introuvable',
        });
    }

    const deletedTeam = await prisma.team.delete({
        where: {
            id,
        },
    });

    return deletedTeam;
});
