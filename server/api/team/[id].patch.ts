import { readBody } from 'h3';
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

    const body = await readBody(event) as { name?: unknown; pokemons?: unknown };
    const data: { name?: string | null; pokemons?: string[] } = {};

    if (body.name !== undefined) {
        data.name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : null;
    }

    if (body.pokemons !== undefined) {
        if (!Array.isArray(body.pokemons) || body.pokemons.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Équipe invalide',
            });
        }

        const pokemons = body.pokemons.map((item) => {
            if (typeof item === 'string') return item;
            if (typeof item === 'number') return String(item);
            return null;
        });

        if (pokemons.some((pokemon) => pokemon === null)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Chaque pokémon doit être un nom ou un identifiant',
            });
        }

        data.pokemons = pokemons as string[];
    }

    const team = await prisma.team.update({
        where: { id },
        data,
    });

    return {
        success: true,
        team,
    };
});
