export default defineEventHandler(async (event) => {
    // On ne protège que /api
    if (!event.path.startsWith('/api/')) {
        return
    }

    // IMPORTANT : laisser passer le login
    if (event.path.startsWith('/api/auth/')) {
        return
    }

    await requireUserId(event)
})