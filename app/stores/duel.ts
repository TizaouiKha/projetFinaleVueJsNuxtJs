import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useDuelStore = defineStore('duel', () => {
    const wins = ref(0)
    const total = ref(0)

    const accuracy = computed(() => (total.value === 0 ? 0 : Math.round((wins.value / total.value) * 100)))

    const recordGuess = (correct: boolean) => {
        total.value += 1
        if (correct) wins.value += 1
    }

    const resetScore = () => {
        wins.value = 0
        total.value = 0
    }

    return {
        wins,
        total,
        accuracy,
        recordGuess,
        resetScore,
    }
})
