import { randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'
import { requireUserSession } from 'nuxt-oidc-auth/runtime/server/utils/session.js'
import prisma from './prisma'

export async function requireUserId(event: H3Event): Promise<string> {
    const session = await requireUserSession(event)

    const appUserId = session?.claims?.appUserId as string | undefined
    if (appUserId) return appUserId

    // Connexion GitHub : pas de claims.appUserId, on rattache/crée un
    // User local à partir de l'identifiant GitHub stable (userInfo.id).
    const userInfo = session?.userInfo as Record<string, unknown> | undefined
    const githubId = userInfo?.id

    if (githubId !== undefined && githubId !== null) {
        const username = `github:${githubId}`

        const existing = await prisma.user.findUnique({ where: { username } })
        if (existing) return existing.id

        const created = await prisma.user.create({
            data: {
                username,
                password: randomUUID(),
            },
        })
        return created.id
    }

    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
}
