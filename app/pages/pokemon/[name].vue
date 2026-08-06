<script setup lang="ts">
import { ref, watch } from 'vue'

const route = useRoute()

const selectedPokemon = ref(null)
const loadingPokemon = ref(false)

const fetchPokemon = async (name: string) => {
  loadingPokemon.value = true
  try {
    const res = await fetch(`/api/pokemon/${encodeURIComponent(name)}`)
    if (!res.ok) {
      selectedPokemon.value = null
    } else {
      selectedPokemon.value = await res.json()
    }
  } catch (e) {
    selectedPokemon.value = null
    console.error(e)
  } finally {
    loadingPokemon.value = false
  }
}

watch(
  () => route.params.name,
  async (newName) => {
    if (typeof newName === 'string') {
      await fetchPokemon(newName)
    }
  },
  { immediate: true }
)
</script>

<template>
  <main class="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)] p-6 text-white">
    <div v-if="loadingPokemon" class="flex min-h-[60vh] items-center justify-center">
      <div class="rounded-2xl border border-slate-700 bg-slate-900/70 px-6 py-4 text-slate-300">
        Chargement du Pokémon...
      </div>
    </div>

    <div v-else-if="selectedPokemon" class="mx-auto flex max-w-5xl flex-col gap-6">
      <NuxtLink to="/" class="w-fit rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800">
        ← Retour à la liste
      </NuxtLink>

      <PokemonDetailCard :pokemon="selectedPokemon" />
    </div>

    <p v-else class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center text-slate-400">
      Ce Pokémon est introuvable.
    </p>
  </main>
</template>