<script setup lang="ts">
import { computed } from 'vue'
import type { Pokemon } from '../types/pokemon'
import { useLocale } from '../composables/useLocale'

const props = defineProps<{
    pokemon: Pokemon
    totalStats: number
    revealed: boolean
    isWinner: boolean
    isPicked: boolean
}>()

const emit = defineEmits<{
    (e: 'pick'): void
}>()

const { t, pokemonName, typeName } = useLocale()

const statRows = computed(() => [
    { label: t('stat_hp'), value: props.pokemon.hp ?? 0 },
    { label: t('stat_attack'), value: props.pokemon.attack ?? 0 },
    { label: t('stat_defense'), value: props.pokemon.defense ?? 0 },
    { label: t('stat_special_attack'), value: props.pokemon.specialAttack ?? 0 },
    { label: t('stat_special_defense'), value: props.pokemon.specialDefense ?? 0 },
    { label: t('stat_speed'), value: props.pokemon.speed ?? 0 },
])
</script>

<template>
    <div
        class="flex flex-col gap-4 rounded-[2rem] border p-6 shadow-xl transition"
        :class="revealed
            ? (isWinner ? 'border-emerald-400 bg-emerald-950/30' : 'border-slate-700 bg-slate-900/60 opacity-70')
            : 'border-slate-700 bg-slate-900/80'"
    >
        <div class="flex flex-col items-center gap-3">
            <img :src="pokemon.image" :alt="pokemon.name" class="h-32 w-32 object-contain drop-shadow-[0_10px_15px_rgba(255,255,255,0.2)]" />
            <h2 class="text-center text-xl font-bold uppercase tracking-wide">{{ pokemonName(pokemon) }}</h2>
            <ul class="flex flex-wrap justify-center gap-2">
                <li
                    v-for="type in pokemon.types"
                    :key="String(type)"
                    class="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium uppercase"
                >
                    {{ typeName(String(type)) }}
                </li>
            </ul>
        </div>

        <div class="space-y-2">
            <div v-for="stat in statRows" :key="stat.label" class="flex items-center gap-3 text-sm">
                <span class="w-24 shrink-0 text-slate-400">{{ stat.label }}</span>
                <div class="h-2 flex-1 rounded-full bg-slate-800">
                    <div class="h-2 rounded-full bg-cyan-400" :style="{ width: `${Math.min(100, (stat.value / 200) * 100)}%` }" />
                </div>
                <span class="w-8 shrink-0 text-right font-semibold">{{ stat.value }}</span>
            </div>
        </div>

        <p v-if="revealed" class="text-center text-sm text-slate-300">{{ t('duel_total_stats', totalStats) }}</p>

        <button
            v-if="!revealed"
            class="mt-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold transition hover:bg-slate-800"
            @click="emit('pick')"
        >
            {{ t('duel_pick') }}
        </button>
        <p
            v-else-if="isPicked"
            class="text-center text-lg font-bold"
            :class="isWinner ? 'text-emerald-400' : 'text-red-400'"
        >
            {{ isWinner ? '✓' : '✕' }}
        </p>
    </div>
</template>
