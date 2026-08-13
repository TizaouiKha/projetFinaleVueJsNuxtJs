<script setup lang="ts">
import { computed } from 'vue'
import type { Pokemon } from '../types/pokemon'
import { useTeamStore } from '../stores/team'
import { useLocale } from '../composables/useLocale'

const props = defineProps<{
  pokemon: Pokemon
  beforeEvolution?: string
  afterEvolution?: string
}>()

const teamStore = useTeamStore()
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
  <section class="overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900/80 shadow-2xl shadow-black/40">
    <div class="bg-gradient-to-r from-red-600 via-rose-500 to-orange-400 p-5 sm:p-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-2">
          <p class="text-sm uppercase tracking-[0.3em] text-slate-900/80">Pokédex</p>
          <h2 class="text-2xl font-black capitalize sm:text-3xl">
            {{ pokemonName(props.pokemon) }}
          </h2>
          <p class="text-sm font-semibold text-slate-900/80">
            N° {{ props.pokemon.id }}
          </p>
        </div>

        <div class="flex flex-col items-start gap-2 sm:items-end">
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="type in props.pokemon.types"
              :key="`badge-${type}`"
              :to="`/types/${type}`"
              class="rounded-full border border-white/40 bg-white/20 px-3 py-1 text-sm font-semibold uppercase tracking-wide backdrop-blur transition hover:bg-white/30"
            >
              {{ typeName(type) }}
            </NuxtLink>
          </div>

          <button
            class="rounded-full border border-white/40 bg-black/30 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/50 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="!teamStore.isInTeam(props.pokemon.id) && teamStore.isFull"
            @click="teamStore.toggleInTeam(props.pokemon)"
          >
            {{ teamStore.isInTeam(props.pokemon.id) ? t('in_team') : t('add_to_team') }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid gap-4 p-4 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div class="flex justify-center">
        <div class="flex h-52 w-52 items-center justify-center rounded-full border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-950 shadow-inner">
          <img
            :src="props.pokemon.image"
            :alt="props.pokemon.name"
            class="h-40 w-40 object-contain drop-shadow-[0_20px_25px_rgba(255,255,255,0.2)]"
          />
        </div>
      </div>

      <div class="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
            <p class="text-xs text-slate-400">{{ t('size') }}</p>
            <p class="mt-0.5 text-lg font-semibold">{{ props.pokemon.height }}</p>
          </div>
          <div class="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
            <p class="text-xs text-slate-400">{{ t('weight') }}</p>
            <p class="mt-0.5 text-lg font-semibold">{{ props.pokemon.weight }}</p>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
          <p class="mb-1.5 text-xs text-slate-400">{{ t('stats_label') }}</p>
          <div class="space-y-1.5">
            <div v-for="stat in statRows" :key="stat.label" class="flex items-center gap-2 text-xs">
              <span class="w-16 shrink-0 text-slate-400">{{ stat.label }}</span>
              <div class="h-1.5 flex-1 rounded-full bg-slate-800">
                <div class="h-1.5 rounded-full bg-cyan-400" :style="{ width: `${Math.min(100, (stat.value / 200) * 100)}%` }" />
              </div>
              <span class="w-7 shrink-0 text-right font-semibold">{{ stat.value }}</span>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
          <p class="mb-1.5 text-xs text-slate-400">{{ t('evolution') }}</p>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl bg-slate-950 p-2.5 text-center">
              <p class="text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">{{ t('before') }}</p>
              <NuxtLink
                v-if="props.beforeEvolution && props.beforeEvolution.toLowerCase() !== 'aucune'"
                :to="`/pokemon/${props.beforeEvolution}`"
                class="block text-sm font-semibold capitalize text-cyan-400 hover:underline"
              >
                {{ props.beforeEvolution }}
              </NuxtLink>
              <p v-else class="text-sm font-semibold capitalize text-cyan-400">
                {{ t('none') }}
              </p>
            </div>
            <div class="rounded-xl bg-slate-950 p-2.5 text-center">
              <p class="text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">{{ t('after') }}</p>
              <NuxtLink
                v-if="props.afterEvolution && props.afterEvolution.toLowerCase() !== 'aucune'"
                :to="`/pokemon/${props.afterEvolution}`"
                class="block text-sm font-semibold capitalize text-cyan-400 hover:underline"
              >
                {{ props.afterEvolution }}
              </NuxtLink>
              <p v-else class="text-sm font-semibold capitalize text-cyan-400">
                {{ t('none') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
