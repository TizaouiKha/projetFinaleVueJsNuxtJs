import { watch } from 'vue'
import { useDuelStore } from '../stores/duel'

const DUEL_STORAGE_KEY = 'pokemon-duel-score'

export default defineNuxtPlugin(() => {
    const duelStore = useDuelStore()

    try {
        const stored = localStorage.getItem(DUEL_STORAGE_KEY)
        if (stored) {
            const parsed = JSON.parse(stored)
            duelStore.wins = parsed.wins ?? 0
            duelStore.total = parsed.total ?? 0
        }
    } catch (err) {
        console.error('Impossible de charger le score sauvegardé', err)
    }

    watch(() => [duelStore.wins, duelStore.total], ([wins, total]) => {
        localStorage.setItem(DUEL_STORAGE_KEY, JSON.stringify({ wins, total }))
    })
})
