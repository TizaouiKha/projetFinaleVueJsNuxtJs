<script setup lang="ts">
import { ref } from 'vue'
import type { Team } from '../types/team'
import type { Pokemon } from '../types/pokemon'
import { useTeam } from '../composables/useTeam'
import { useLocale } from '../composables/useLocale'

const props = defineProps<{
    teams: Team[]
}>()

const { deleteTeam, deleteMessage, loading } = useTeam()
const { t, pokemonName } = useLocale()

const confirmingId = ref<number | null>(null)

const askDelete = (id: number) => {
    confirmingId.value = id
}

const cancelDelete = () => {
    confirmingId.value = null
}

const confirmDelete = async (id: number) => {
    await deleteTeam(id)
    confirmingId.value = null
}

const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

const imageSrc = (pokemon: Pokemon) => pokemon.image || pokemon.defaultImage || ''

const onImageError = (event: Event, pokemon: Pokemon) => {
    const img = event.target as HTMLImageElement
    if (pokemon.defaultImage && img.src !== pokemon.defaultImage) {
        img.src = pokemon.defaultImage
    }
}
</script>

<template>
    <section class="space-y-4">
        <h2 class="text-2xl font-bold">{{ t('saved_teams_title') }}</h2>

        <p v-if="deleteMessage" class="text-sm text-slate-400">
            {{ deleteMessage }}
        </p>

        <div v-if="loading" class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center text-slate-400">
            {{ t('loading_teams') }}
        </div>

        <div v-else-if="teams.length === 0" class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center text-slate-400">
            {{ t('no_saved_teams') }}
        </div>

        <ul v-else class="space-y-4">
            <li
                v-for="team in teams"
                :key="team.id"
                class="rounded-2xl border border-slate-700 bg-slate-900/80 p-4"
            >
                <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p class="font-semibold text-slate-200">{{ t('team_number', team.id) }}</p>
                        <p v-if="team.createdAt" class="text-xs text-slate-500">{{ t('team_saved_on', formatDate(team.createdAt)) }}</p>
                    </div>

                    <div class="flex items-center gap-2">
                        <template v-if="confirmingId === team.id">
                            <span class="text-sm text-slate-300">{{ t('confirm_delete_team') }}</span>
                            <button
                                type="button"
                                class="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-500"
                                @click="confirmDelete(team.id)"
                            >
                                {{ t('delete_team') }}
                            </button>
                            <button
                                type="button"
                                class="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800"
                                @click="cancelDelete"
                            >
                                {{ t('cancel') }}
                            </button>
                        </template>
                        <button
                            v-else
                            type="button"
                            class="rounded-lg border border-red-800 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950"
                            @click="askDelete(team.id)"
                        >
                            {{ t('delete_team') }}
                        </button>
                    </div>
                </div>

                <ul class="flex flex-wrap gap-3">
                    <li
                        v-for="pokemon in team.pokemons"
                        :key="pokemon.id"
                        class="flex w-36 flex-col items-center rounded-xl bg-slate-800 p-3"
                    >
                        <img
                            :src="imageSrc(pokemon)"
                            :alt="pokemon.name"
                            class="h-20 w-20 object-contain"
                            @error="onImageError($event, pokemon)"
                        />

                        <p class="mt-2 text-center text-sm font-medium capitalize text-slate-200">
                            {{ pokemonName(pokemon) }}
                        </p>
                    </li>
                </ul>
            </li>
        </ul>
    </section>
</template>
