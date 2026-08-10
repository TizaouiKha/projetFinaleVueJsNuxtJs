<script setup lang="ts">
import type { Pokemon } from '../types/pokemon'

const props = defineProps<{
  pokemon: Pokemon
  beforeEvolution?: string
  afterEvolution?: string
}>()
</script>

<template>
  <section class="overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900/80 shadow-2xl shadow-black/40">
    <div class="bg-gradient-to-r from-red-600 via-rose-500 to-orange-400 p-6 sm:p-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-3">
          <p class="text-sm uppercase tracking-[0.3em] text-slate-900/80">Pokédex</p>
          <h2 class="text-3xl font-black capitalize sm:text-4xl">
            {{ props.pokemon.name }}
          </h2>
          <p class="text-sm font-semibold text-slate-900/80">
            N° {{ props.pokemon.id }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="type in props.pokemon.types"
            class="rounded-full border border-white/40 bg-white/20 px-3 py-1 text-sm font-semibold uppercase tracking-wide backdrop-blur"
          >
            {{ type }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div class="flex justify-center">
        <div class="flex h-72 w-72 items-center justify-center rounded-full border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-950 shadow-inner">
          <img
            :src="props.pokemon.image"
            :alt="props.pokemon.name"
            class="h-56 w-56 object-contain drop-shadow-[0_20px_25px_rgba(255,255,255,0.2)]"
          />
        </div>
      </div>

      <div class="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <p class="text-sm text-slate-400">Taille</p>
            <p class="mt-1 text-xl font-semibold">{{ props.pokemon.height }}</p>
          </div>
          <div class="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <p class="text-sm text-slate-400">Poids</p>
            <p class="mt-1 text-xl font-semibold">{{ props.pokemon.weight }}</p>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <p class="mb-2 text-sm text-slate-400">Types</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="type in props.pokemon.types"
              class="rounded-full bg-slate-800 px-3 py-1 text-sm font-medium"
            >
              {{ type }}
            </span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <p class="mb-2 text-sm text-slate-400">Évolution</p>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl bg-slate-950 p-4 text-center">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Avant</p>
              <div class="mt-2">
                <NuxtLink
                  v-if="props.beforeEvolution && props.beforeEvolution.toLowerCase() !== 'aucune'"
                  :to="`/pokemon/${props.beforeEvolution}`"
                  class="block text-lg font-semibold capitalize text-cyan-400 hover:underline"
                >
                  {{ props.beforeEvolution }}
                </NuxtLink>
                <p v-else class="block text-lg font-semibold capitalize text-cyan-400">
                  Aucune
                </p>
              </div>
            </div>
            <div class="rounded-xl bg-slate-950 p-4 text-center">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Après</p>
              <div class="mt-2">
                <NuxtLink
                  v-if="props.afterEvolution && props.afterEvolution.toLowerCase() !== 'aucune'"
                  :to="`/pokemon/${props.afterEvolution}`"
                  class="block text-lg font-semibold capitalize text-cyan-400 hover:underline"
                >
                  {{ props.afterEvolution }}
                </NuxtLink>
                <p v-else class="block text-lg font-semibold capitalize text-cyan-400">
                  Aucune
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
