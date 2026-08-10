<script setup lang="ts">
import { computed } from 'vue'
import { MAX_TEAM_SIZE, useTeamStore } from '../stores/team'
import TeamSlot from './TeamSlot.vue'

const teamStore = useTeamStore()

const slots = computed(() => {
    const filled = teamStore.team
    const empty = Array.from({ length: Math.max(0, MAX_TEAM_SIZE - filled.length) })
    return [...filled, ...empty]
})
</script>

<template>
    <section class="space-y-6">
        <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
                <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Composition d'équipe</p>
                <h1 class="text-3xl font-bold">Mon équipe</h1>
                <p class="text-slate-400">{{ teamStore.teamCount }} / {{ MAX_TEAM_SIZE }} Pokémon</p>
            </div>

            <button
                class="w-fit rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="teamStore.teamCount === 0"
                @click="teamStore.clearTeam()"
            >
                Vider l'équipe
            </button>
        </header>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <TeamSlot
                v-for="(pokemon, index) in slots"
                :key="pokemon ? pokemon.id : `empty-${index}`"
                :pokemon="pokemon"
                @remove="teamStore.removeFromTeam"
            />
        </div>
    </section>
</template>
