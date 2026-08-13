import bcrypt from 'bcryptjs'
import prisma from '../../utils/prisma'
import { setUserSession } from 'nuxt-oidc-auth/runtime/server/utils/session.js'

export default defineEventHandler(async (event) => {
    const nowSeconds = Math.floor(Date.now() / 1000)
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email et mot de passe requis' })
  }

  const user = await prisma.user.findUnique({ where: { username: email } })
  if (!user) {
    throw createError({ statusCode: 401, message: 'Identifiants invalides' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Identifiants invalides' })
  }

await setUserSession(event, {
  provider: 'github',
  canRefresh: false,
  loggedInAt: nowSeconds,
  expireAt: nowSeconds + 60 * 60 * 24,
  userName: user.username,
  claims: {
    appUserId: user.id,
    authMethod: 'credentials'
  }
})

  return { success: true }
})