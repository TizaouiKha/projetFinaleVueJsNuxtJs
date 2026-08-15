import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
    return prisma.npcTeam.findMany({
        orderBy: { id: 'asc' },
    })
})
