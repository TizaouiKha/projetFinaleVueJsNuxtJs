export default defineEventHandler(async (event) => {
    if (!event.path.startsWith('/api/')) {
        return
    }

    if (event.path.startsWith('/api/auth/')) {
        return
    }

    await requireUserId(event)
})
