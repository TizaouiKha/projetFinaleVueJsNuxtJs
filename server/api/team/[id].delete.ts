import prisma from '../../utils/prisma';
import { requireUserId } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    const userId = await requireUserId(event);
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

    if (existing.userId !== userId) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Cette équipe ne t\'appartient pas',
        });
    }

    const deletedTeam = await prisma.team.delete({
        where: {
            id,
        },
    });

    return deletedTeam;
});
