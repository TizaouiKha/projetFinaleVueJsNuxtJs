import bcrypt from 'bcryptjs'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)

  if (!username || !password) {
    throw createError({ statusCode: 400, message: 'Champs manquants' })
  }

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) {
    throw createError({ statusCode: 409, message: 'Cet email est déjà utilisé' })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { username, password: hashed }
  })

  return { success: true, id: user.id }
})