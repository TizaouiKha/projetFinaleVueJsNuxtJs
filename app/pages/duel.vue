<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { useDuelStore } from '~/stores/duel'
import type { Pokemon } from '~/types/pokemon'
import DuelCard from '~/components/DuelCard.vue'

const STAT_KEYS = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed']
const TOTAL_JOKERS = 4

const { t } = useLocale()
const duelStore = useDuelStore()

const combatants = ref<Pokemon[]>([])
const loading = ref(false)
const pickedId = ref<number | null>(null)
const revealed = ref(false)
const jokersRemaining = ref(TOTAL_JOKERS)
const visibleStatsA = ref<string[]>([])
const visibleStatsB = ref<string[]>([])

const totalStats = (p: Pokemon) =>
    (p.hp ?? 0) + (p.attack ?? 0) + (p.defense ?? 0) + (p.specialAttack ?? 0) + (p.specialDefense ?? 0) + (p.speed ?? 0)

const winnerId = computed(() => {
    if (combatants.value.length < 2) return null
    const [a, b] = combatants.value
    const totalA = totalStats(a)
    const totalB = totalStats(b)
    if (totalA === totalB) return null
    return totalA > totalB ? a.id : b.id
})

const isTie = computed(() => revealed.value && combatants.value.length === 2 && winnerId.value === null)

const loadDuel = async () => {
    loading.value = true
    pickedId.value = null
    revealed.value = false
    jokersRemaining.value = TOTAL_JOKERS
    visibleStatsA.value = []
    visibleStatsB.value = []
    try {
        const res = await fetch('/api/pokemon/random?count=2')
        combatants.value = await res.json()
    } finally {
        loading.value = false
    }
}

const useJoker = (visibleStats: string[]) => {
    if (jokersRemaining.value <= 0) return
    const hidden = STAT_KEYS.filter((key) => !visibleStats.includes(key))
    if (hidden.length === 0) return

    hidden.sort(() => Math.random() - 0.5)
    visibleStats.push(...hidden.slice(0, 2))
    jokersRemaining.value -= 1
}

const pick = (pokemon: Pokemon) => {
    if (revealed.value || combatants.value.length < 2) return
    pickedId.value = pokemon.id
    revealed.value = true

    if (winnerId.value !== null) {
        duelStore.recordGuess(pokemon.id === winnerId.value)
    }
}

onMounted(loadDuel)
</script>

<template>
    <main class="min-h-screen bg-slate-950 text-white p-6">
        <div class="mx-auto max-w-5xl space-y-6">
            <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div class="space-y-1">
                    <p class="text-sm uppercase tracking-[0.3em] text-slate-400">{{ t('nav_duel') }}</p>
                    <h1 class="text-3xl font-bold">{{ t('duel_title') }}</h1>
                    <p class="text-slate-400">{{ t('duel_description') }}</p>
                </div>
                <div class="flex flex-col items-start gap-2 sm:items-end">
                    <p class="text-sm text-slate-300">{{ t('duel_score', duelStore.wins, duelStore.total, duelStore.accuracy) }}</p>
                    <p v-if="!revealed" class="text-xs text-slate-400">{{ t('duel_jokers_remaining', jokersRemaining) }}</p>
                    <button
                        class="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:bg-slate-800"
                        @click="duelStore.resetScore()"
                    >
                        {{ t('duel_reset_score') }}
                    </button>
                </div>
            </header>

            <div v-if="loading" class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center text-slate-400">
                {{ t('duel_loading') }}
            </div>

            <div v-else-if="combatants.length === 2" class="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <DuelCard
                    :pokemon="combatants[0]"
                    :total-stats="totalStats(combatants[0])"
                    :revealed="revealed"
                    :is-winner="revealed && winnerId === combatants[0].id"
                    :is-picked="pickedId === combatants[0].id"
                    :visible-stats="visibleStatsA"
                    :jokers-remaining="jokersRemaining"
                    @pick="pick(combatants[0])"
                    @use-joker="useJoker(visibleStatsA)"
                />

                <p class="text-center text-2xl font-black text-slate-600">{{ t('duel_vs') }}</p>

                <DuelCard
                    :pokemon="combatants[1]"
                    :total-stats="totalStats(combatants[1])"
                    :revealed="revealed"
                    :is-winner="revealed && winnerId === combatants[1].id"
                    :is-picked="pickedId === combatants[1].id"
                    :visible-stats="visibleStatsB"
                    :jokers-remaining="jokersRemaining"
                    @pick="pick(combatants[1])"
                    @use-joker="useJoker(visibleStatsB)"
                />
            </div>

            <div v-if="revealed" class="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-center">
                <p v-if="isTie" class="text-slate-300">{{ t('duel_tie') }}</p>
                <p v-else class="font-semibold" :class="pickedId === winnerId ? 'text-emerald-400' : 'text-red-400'">
                    {{ pickedId === winnerId ? t('duel_correct') : t('duel_incorrect') }}
                </p>
                <button
                    class="rounded-full border border-slate-700 px-6 py-2 text-sm font-semibold transition hover:bg-slate-800"
                    @click="loadDuel"
                >
                    {{ t('duel_new') }}
                </button>
            </div>
        </div>
    </main>
</template>
