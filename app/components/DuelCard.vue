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
    visibleStats: string[]
    jokersRemaining: number
}>()

const emit = defineEmits<{
    (e: 'pick'): void
    (e: 'use-joker'): void
}>()

const { t, pokemonName, typeName } = useLocale()

const statRows = computed(() => [
    { key: 'hp', label: t('stat_hp'), value: props.pokemon.hp ?? 0 },
    { key: 'attack', label: t('stat_attack'), value: props.pokemon.attack ?? 0 },
    { key: 'defense', label: t('stat_defense'), value: props.pokemon.defense ?? 0 },
    { key: 'specialAttack', label: t('stat_special_attack'), value: props.pokemon.specialAttack ?? 0 },
    { key: 'specialDefense', label: t('stat_special_defense'), value: props.pokemon.specialDefense ?? 0 },
    { key: 'speed', label: t('stat_speed'), value: props.pokemon.speed ?? 0 },
])

const isVisible = (key: string) => props.revealed || props.visibleStats.includes(key)
const hasHiddenStats = computed(() => statRows.value.some((s) => !isVisible(s.key)))
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
            <div v-for="stat in statRows" :key="stat.key" class="flex items-center gap-3 text-sm">
                <span class="w-24 shrink-0 text-slate-400">{{ stat.label }}</span>
                <div class="h-2 flex-1 rounded-full bg-slate-800">
                    <div
                        v-if="isVisible(stat.key)"
                        class="h-2 rounded-full bg-cyan-400"
                        :style="{ width: `${Math.min(100, (stat.value / 200) * 100)}%` }"
                    />
                </div>
                <span class="w-8 shrink-0 text-right font-semibold">{{ isVisible(stat.key) ? stat.value : '?' }}</span>
            </div>
        </div>

        <p v-if="revealed" class="text-center text-sm text-slate-300">{{ t('duel_total_stats', totalStats) }}</p>

        <div v-if="!revealed" class="mt-2 flex flex-col gap-2">
            <button
                v-if="hasHiddenStats"
                class="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="jokersRemaining <= 0"
                @click="emit('use-joker')"
            >
                {{ t('duel_use_joker') }}
            </button>
            <button
                class="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold transition hover:bg-slate-800"
                @click="emit('pick')"
            >
                {{ t('duel_pick') }}
            </button>
        </div>
        <p
            v-else-if="isPicked"
            class="text-center text-lg font-bold"
            :class="isWinner ? 'text-emerald-400' : 'text-red-400'"
        >
            {{ isWinner ? '✓' : '✕' }}
        </p>
    </div>
</template>
