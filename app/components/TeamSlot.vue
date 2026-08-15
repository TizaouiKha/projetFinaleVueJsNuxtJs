<script setup lang="ts">
import type { Pokemon } from '../types/pokemon'
import { useLocale } from '../composables/useLocale'

const props = defineProps<{
    pokemon?: Pokemon
}>()

const emit = defineEmits<{
    (e: 'remove', pokemonId: number): void
}>()

const { t, pokemonName } = useLocale()
</script>

<template>
    <div
        v-if="props.pokemon"
        class="group relative flex flex-col items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-lg"
    >
        <button
            class="absolute right-2 top-2 rounded-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-xs text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-600 hover:text-white"
            :title="t('remove_from_team')"
            @click="emit('remove', props.pokemon.id)"
        >
            ✕
        </button>

        <NuxtLink :to="`/pokemon/${props.pokemon.name}`" class="flex flex-col items-center gap-2">
            <img
                :src="props.pokemon.image"
                :alt="props.pokemon.name"
                class="h-20 w-20 object-contain drop-shadow-[0_10px_15px_rgba(255,255,255,0.2)]"
            />
            <p class="text-sm font-semibold uppercase tracking-wide text-white">
                {{ pokemonName(props.pokemon) }}
            </p>
            <p class="text-xs text-slate-400">N° {{ props.pokemon.id }}</p>
        </NuxtLink>
    </div>

    <div
        v-else
        class="flex h-[9.5rem] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-slate-500"
    >
        <span class="text-2xl">+</span>
        <p class="text-xs uppercase tracking-wide">{{ t('empty_slot') }}</p>
    </div>
</template>
