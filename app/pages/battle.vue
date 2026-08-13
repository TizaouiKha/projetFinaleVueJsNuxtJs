<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { useTeam } from '~/composables/useTeam'
import { useBattleStore } from '~/stores/battle'
import type { Difficulty } from '~/composables/useBattleEngine'
import type { Pokemon } from '~/types/pokemon'
import BattleArena from '~/components/BattleArena.vue'

interface NpcTeam {
    id: number
    name: string
    difficulty: Difficulty
    pokemons: string[]
}

const { t, pokemonName } = useLocale()
const { allTeams, fetchTeams } = useTeam()
const battleStore = useBattleStore()

const npcTeams = ref<NpcTeam[]>([])
const selectedTeamId = ref<number | null>(null)
const opponentMode = ref<'npc' | 'own'>('npc')
const selectedNpcId = ref<number | null>(null)
const selectedOpponentTeamId = ref<number | null>(null)
const preparing = ref(false)
const prepareError = ref('')

onMounted(async () => {
    await fetchTeams()
    npcTeams.value = await $fetch<NpcTeam[]>('/api/npc-teams')
})

const npcTeamsByDifficulty = computed(() => ({
    easy: npcTeams.value.filter((team) => team.difficulty === 'easy'),
    medium: npcTeams.value.filter((team) => team.difficulty === 'medium'),
    hard: npcTeams.value.filter((team) => team.difficulty === 'hard'),
}))

const opponentTeamOptions = computed(() =>
    allTeams.value.filter((team) => team.id !== selectedTeamId.value),
)

const canStart = computed(() => {
    if (!selectedTeamId.value) return false
    if (opponentMode.value === 'npc') return !!selectedNpcId.value
    return !!selectedOpponentTeamId.value
})

const handleStart = async () => {
    const myTeam = allTeams.value.find((team) => team.id === selectedTeamId.value)
    if (!myTeam) return

    let opponentNames: string[] = []
    let opponentLabel = ''
    let isNpc = true
    let difficulty: Difficulty = 'medium'

    if (opponentMode.value === 'npc') {
        const npc = npcTeams.value.find((team) => team.id === selectedNpcId.value)
        if (!npc) return
        opponentNames = npc.pokemons
        opponentLabel = npc.name
        difficulty = npc.difficulty
    } else {
        const oppTeam = allTeams.value.find((team) => team.id === selectedOpponentTeamId.value)
        if (!oppTeam) return
        opponentNames = oppTeam.pokemons.map((p) => p.name)
        opponentLabel = oppTeam.name || t('team_number', oppTeam.id)
        isNpc = false
    }

    preparing.value = true
    prepareError.value = ''

    try {
        const playerNames = myTeam.pokemons.map((p) => p.name)
        const [playerReady, opponentReady] = await Promise.all([
            $fetch<Pokemon[]>('/api/battle/prepare', { method: 'POST', body: { names: playerNames } }),
            $fetch<Pokemon[]>('/api/battle/prepare', { method: 'POST', body: { names: opponentNames } }),
        ])

        battleStore.startBattle(playerReady, opponentReady, opponentLabel, { isNpc, difficulty })
    } catch (err) {
        console.error(err)
        prepareError.value = t('battle_prepare_error')
    } finally {
        preparing.value = false
    }
}

const handleNewBattle = () => {
    battleStore.resetBattle()
    selectedNpcId.value = null
    selectedOpponentTeamId.value = null
}
</script>

<template>
    <main class="min-h-screen bg-slate-950 p-6 text-white">
        <div class="mx-auto max-w-5xl space-y-6">
            <template v-if="battleStore.phase === 'idle'">
                <header class="space-y-2">
                    <p class="text-sm uppercase tracking-[0.3em] text-slate-400">{{ t('nav_battle') }}</p>
                    <h1 class="text-3xl font-bold">{{ t('battle_setup_title') }}</h1>
                    <p class="text-slate-400">{{ t('battle_setup_description') }}</p>
                </header>

                <div v-if="allTeams.length === 0" class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center text-slate-400">
                    {{ t('battle_need_team') }}
                </div>

                <template v-else>
                    <section class="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                        <h2 class="text-lg font-semibold">{{ t('battle_choose_team') }}</h2>
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="team in allTeams"
                                :key="team.id"
                                type="button"
                                class="rounded-lg border px-4 py-2 text-sm transition"
                                :class="selectedTeamId === team.id
                                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                                    : 'border-slate-700 text-slate-300 hover:bg-slate-800'"
                                @click="selectedTeamId = team.id"
                            >
                                {{ team.name || t('team_number', team.id) }} ({{ team.pokemons.length }})
                            </button>
                        </div>
                    </section>

                    <section class="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                        <h2 class="text-lg font-semibold">{{ t('battle_choose_opponent') }}</h2>

                        <div class="flex gap-2">
                            <button
                                type="button"
                                class="rounded-lg border px-4 py-2 text-sm transition"
                                :class="opponentMode === 'npc' ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300' : 'border-slate-700 text-slate-300 hover:bg-slate-800'"
                                @click="opponentMode = 'npc'"
                            >
                                {{ t('battle_opponent_npc') }}
                            </button>
                            <button
                                type="button"
                                class="rounded-lg border px-4 py-2 text-sm transition"
                                :class="opponentMode === 'own' ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300' : 'border-slate-700 text-slate-300 hover:bg-slate-800'"
                                @click="opponentMode = 'own'"
                            >
                                {{ t('battle_opponent_own_team') }}
                            </button>
                        </div>

                        <div v-if="opponentMode === 'npc'" class="space-y-3">
                            <div v-for="tier in (['easy', 'medium', 'hard'] as const)" :key="tier">
                                <p class="mb-1.5 text-xs uppercase tracking-wide text-slate-500">{{ t(`battle_difficulty_${tier}`) }}</p>
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        v-for="npc in npcTeamsByDifficulty[tier]"
                                        :key="npc.id"
                                        type="button"
                                        class="rounded-lg border px-4 py-2 text-sm transition"
                                        :class="selectedNpcId === npc.id
                                            ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                                            : 'border-slate-700 text-slate-300 hover:bg-slate-800'"
                                        @click="selectedNpcId = npc.id"
                                    >
                                        {{ npc.name }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-else>
                            <p v-if="opponentTeamOptions.length === 0" class="text-sm text-slate-400">
                                {{ t('battle_need_two_teams') }}
                            </p>
                            <div v-else class="flex flex-wrap gap-2">
                                <button
                                    v-for="team in opponentTeamOptions"
                                    :key="team.id"
                                    type="button"
                                    class="rounded-lg border px-4 py-2 text-sm transition"
                                    :class="selectedOpponentTeamId === team.id
                                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                                        : 'border-slate-700 text-slate-300 hover:bg-slate-800'"
                                    @click="selectedOpponentTeamId = team.id"
                                >
                                    {{ team.name || t('team_number', team.id) }} ({{ team.pokemons.length }})
                                </button>
                            </div>
                        </div>
                    </section>

                    <p v-if="prepareError" class="text-sm text-red-400">{{ prepareError }}</p>

                    <button
                        type="button"
                        class="w-full rounded-xl border border-cyan-500 bg-cyan-950/40 px-6 py-3 text-lg font-semibold text-cyan-300 transition hover:bg-cyan-900/50 disabled:cursor-not-allowed disabled:opacity-40"
                        :disabled="!canStart || preparing"
                        @click="handleStart"
                    >
                        {{ preparing ? t('battle_preparing') : t('battle_start') }}
                    </button>
                </template>
            </template>

            <BattleArena v-else @new-battle="handleNewBattle" />
        </div>
    </main>
</template>
