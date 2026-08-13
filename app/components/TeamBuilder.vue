<script setup lang="ts">
import { computed } from 'vue'
import { MAX_TEAM_SIZE, useTeamStore } from '../stores/team'
import { useLocale } from '../composables/useLocale'
import { useTeam } from '../composables/useTeam'
import TeamSlot from './TeamSlot.vue'

const teamStore = useTeamStore()
const { t } = useLocale()

const slots = computed(() => {
    const filled = teamStore.team
    const empty = Array.from({ length: Math.max(0, MAX_TEAM_SIZE - filled.length) })
    return [...filled, ...empty]
})

const { saveTeam, saveMessage, saving } = useTeam()

const createTeam = async () => {
    const success = await saveTeam(teamStore.team)
    if (success) {
        teamStore.clearTeam()
    }
}
</script>

<template>
    <section class="space-y-6">
        <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
                <p class="text-sm uppercase tracking-[0.3em] text-slate-400">{{ t('team_building') }}</p>
                <h1 class="text-3xl font-bold">{{ t('my_team') }}</h1>
                <p class="text-slate-400">{{ t('pokemon_count', teamStore.teamCount, MAX_TEAM_SIZE) }}</p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <NuxtLink
                    to="/teams"
                    class="w-fit rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                >
                    {{ t('view_saved_teams') }}
                </NuxtLink>
                <button
                    class="w-fit rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="teamStore.teamCount === 0"
                    @click="teamStore.clearTeam()"
                >
                    {{ t('empty_team') }}
                </button>
                <button
                    class="w-fit rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="teamStore.teamCount === 0 || saving"
                    @click="createTeam"
                >
                    {{ saving ? t('saving_team') : t('save_team_button') }}
                </button>
            </div>
        </header>
        <p v-if="saveMessage" class="text-sm text-slate-400">
            {{ saveMessage }}
        </p>

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
