<script setup lang="ts">
import type { Pokemon } from '../types/pokemon'
import { useTeamStore } from '../stores/team'

const props = defineProps<{
    pokemon: Pokemon & { image?: string, types?: { name: string, url: string }[] }
}>()

const teamStore = useTeamStore()

const handleToggleTeam = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    teamStore.toggleInTeam(props.pokemon)
}
</script>

<template>
    <NuxtLink
        :to="`/pokemon/${props.pokemon.name}`"
        class="group relative block overflow-hidden rounded-[1.5rem] border border-slate-700 bg-slate-900/80 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
    >
        <button
            class="absolute right-3 top-3 z-10 rounded-full border border-white/40 bg-black/50 px-2 py-1 text-xs text-white backdrop-blur transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
            :class="{ 'bg-emerald-600/80 border-emerald-400': teamStore.isInTeam(props.pokemon.id) }"
            :disabled="!teamStore.isInTeam(props.pokemon.id) && teamStore.isFull"
            :title="teamStore.isInTeam(props.pokemon.id) ? 'Retirer de l\'équipe' : 'Ajouter à l\'équipe'"
            @click="handleToggleTeam"
        >
            {{ teamStore.isInTeam(props.pokemon.id) ? '★' : '☆' }}
        </button>

        <div
            class="flex h-36 items-center justify-center rounded-b-[1.5rem] p-4"
            :class="pokemonTypeColors[`${props.pokemon.types?.[0] ?? 'normal'}Card` as keyof typeof pokemonTypeColors]"
        >
            <img
                :src="props.pokemon.image"
                :alt="`Image de ${props.pokemon.name.toUpperCase()}`"
                class="h-24 w-24 object-contain drop-shadow-[0_10px_15px_rgba(255,255,255,0.2)]"
            />
        </div>

        <div class="space-y-3 p-4">
            <div class="flex items-center justify-between text-sm text-slate-400">
                <span>N° {{ props.pokemon.id }}</span>
                <span class="rounded-full bg-slate-800/70 px-2 py-1 text-[10px] uppercase tracking-wide">{{ props.pokemon.types?.[0] }}</span>
            </div>

            <h3 class="text-lg font-bold uppercase tracking-wide text-white">
                {{ props.pokemon.name }}
            </h3>

            <ul class="flex flex-wrap gap-2">
                <li v-for="type in props.pokemon.types">
                    <TypeTag :type="type" />
                </li>
            </ul>
        </div>
    </NuxtLink>
</template>