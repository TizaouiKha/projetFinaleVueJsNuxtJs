import { watch } from 'vue'
import { TEAM_STORAGE_KEY, useTeamStore } from '../stores/team'

export default defineNuxtPlugin(() => {
    const teamStore = useTeamStore()

    try {
        const stored = localStorage.getItem(TEAM_STORAGE_KEY)
        if (stored) teamStore.team = JSON.parse(stored)
    } catch (err) {
        console.error('Impossible de charger la team sauvegardée', err)
    }

    watch(() => teamStore.team, (value) => {
        localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(value))
    }, { deep: true })
})
