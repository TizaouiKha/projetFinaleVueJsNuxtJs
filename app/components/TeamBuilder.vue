<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { MAX_TEAM_SIZE, useTeamStore } from '../stores/team'
import { useLocale } from '../composables/useLocale'
import { useTeam } from '../composables/useTeam'
import type { Team } from '../types/team'
import TeamSlot from './TeamSlot.vue'
import TeamsDatatable from './TeamsDatatable.vue'

const teamStore = useTeamStore()
const { t } = useLocale()

const slots = computed(() => {
    const filled = teamStore.team
    const empty = Array.from({ length: Math.max(0, MAX_TEAM_SIZE - filled.length) })
    return [...filled, ...empty]
})

const { allTeams, fetchTeams, saveTeam, updateTeam, saveMessage, saving } = useTeam()

const teamName = ref('')
const editingTeamId = ref<number | null>(null)

onMounted(async () => {
    await fetchTeams()
})

const startEditingTeam = (team: Team) => {
    teamStore.team = [...team.pokemons]
    teamName.value = team.name ?? ''
    editingTeamId.value = team.id
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEditing = () => {
    teamStore.clearTeam()
    teamName.value = ''
    editingTeamId.value = null
}

const handleSave = async () => {
    const success = editingTeamId.value !== null
        ? await updateTeam(editingTeamId.value, teamStore.team, teamName.value)
        : await saveTeam(teamStore.team, teamName.value)

    if (success) {
        teamStore.clearTeam()
        teamName.value = ''
        editingTeamId.value = null
    }
}
</script>

<template>
    <section class="space-y-6">
        <header class="flex flex-col gap-4">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div class="space-y-1">
                    <p class="text-sm uppercase tracking-[0.3em] text-slate-400">{{ t('team_building') }}</p>
                    <h1 class="text-3xl font-bold">{{ t('my_team') }}</h1>
                    <p class="text-slate-400">{{ t('pokemon_count', teamStore.teamCount, MAX_TEAM_SIZE) }}</p>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                    <button
                        class="w-fit rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="teamStore.teamCount === 0"
                        @click="teamStore.clearTeam()"
                    >
                        {{ t('empty_team') }}
                    </button>
                    <button
                        v-if="editingTeamId !== null"
                        class="w-fit rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                        @click="cancelEditing"
                    >
                        {{ t('cancel_edit') }}
                    </button>
                    <button
                        class="w-fit rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="teamStore.teamCount === 0 || saving"
                        @click="handleSave"
                    >
                        {{ saving ? t('saving_team') : (editingTeamId !== null ? t('update_team_button') : t('save_team_button')) }}
                    </button>
                </div>
            </div>

            <p v-if="editingTeamId !== null" class="text-sm text-cyan-400">
                {{ t('editing_team_notice', editingTeamId) }}
            </p>

            <div class="flex flex-col gap-1 sm:max-w-xs">
                <label for="teamName" class="text-sm text-slate-300">{{ t('team_name_label') }}</label>
                <input
                    id="teamName"
                    v-model="teamName"
                    type="text"
                    :placeholder="t('team_name_placeholder')"
                    class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                />
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

        <div class="pt-4">
            <TeamsDatatable :teams="allTeams" @edit="startEditingTeam" />
        </div>
    </section>
</template>
