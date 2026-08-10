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

    const stale = teamStore.team.filter((pokemon) => pokemon.nameFr === undefined)
    if (stale.length > 0) {
        Promise.all(
            stale.map(async (pokemon) => {
                try {
                    const res = await fetch(`/api/pokemon/${encodeURIComponent(pokemon.name)}`)
                    if (!res.ok) return
                    const fresh = await res.json()
                    const target = teamStore.team.find((p) => p.id === pokemon.id)
                    if (target) target.nameFr = fresh.nameFr ?? null
                } catch (err) {
                    console.error(`Impossible de rafraîchir ${pokemon.name}`, err)
                }
            })
        )
    }

    watch(() => teamStore.team, (value) => {
        localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(value))
    }, { deep: true })
})
