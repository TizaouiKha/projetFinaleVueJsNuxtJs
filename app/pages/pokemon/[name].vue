<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePokemonEvolutions } from '@/composables/usePokemonEvolutions'
import type { Pokemon } from '@/types/pokemon'

const route = useRoute()
const { beforeEvolution, afterEvolution, getPokemonEvolutions } = usePokemonEvolutions()

const selectedPokemon = ref<Pokemon | null>(null)
const loadingPokemon = ref(false)
const speciesData = ref<any>(null)
const cryAutoplayFailed = ref(false)
const cryAttempted = ref(false)


const fetchPokemon = async (name: string) => {
  loadingPokemon.value = true
  beforeEvolution.value = ''
  afterEvolution.value = ''

  try {
    const res = await fetch(`/api/pokemon/${encodeURIComponent(name)}`)
    if (!res.ok) {
      selectedPokemon.value = null
    } else {
      selectedPokemon.value = await res.json()
      if (selectedPokemon.value?.id) {
        await getPokemonEvolutions(selectedPokemon.value.id)
        tryPlayCry()
      }
    }
  } catch (e) {
    selectedPokemon.value = null
    console.error(e)
  } finally {
    loadingPokemon.value = false
  }
}

const buildCryUrl = (name: string | undefined | null) => {
  // Prefer cry from DB if available
  const dbCry = selectedPokemon.value?.cry
  if (dbCry && typeof dbCry === 'string') {
    if (dbCry.startsWith('http')) return dbCry
    if (dbCry.endsWith('.mp3')) return `https://play.pokemonshowdown.com/audio/cries/${dbCry}`
  }

  if (!name) return null
  const parsed = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\./g, '')
    .replace(/[^a-z0-9-]/g, '')
  return `https://play.pokemonshowdown.com/audio/cries/${parsed}.mp3`
}

const tryPlayCry = async () => {
  if (!selectedPokemon.value?.name) return
  const url = buildCryUrl(selectedPokemon.value.name)
  if (!url) return
  const a = new Audio(url)
  a.preload = 'auto'
  cryAttempted.value = true
  try {
    await a.play()
    cryAutoplayFailed.value = false
  } catch (e) {
    cryAutoplayFailed.value = true
  }
}

const pokemonEvolutions = async () => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${selectedPokemon.value?.id}`);
    if (!res.ok) {
      console.error('Failed to fetch Pokemon species data');
      return;
    }
    speciesData.value = await res.json();
    console.log('Species Data:', speciesData.value);
  } catch (e) {
    console.error('Error fetching Pokemon species data:', e); 
  }
}

watch(
  () => route.params.name,
  async (newName) => {
    if (typeof newName === 'string') {
      await fetchPokemon(newName)
      await pokemonEvolutions()
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

      <PokemonDetailCard
        :pokemon="selectedPokemon"
        :before-evolution="beforeEvolution"
        :after-evolution="afterEvolution"
      />
      <div class="flex items-center gap-3">
        <p v-if="cryAttempted && cryAutoplayFailed" class="text-sm text-slate-400">Autoplay bloqué</p>
        <p v-else-if="!cryAttempted" class="text-sm text-slate-400">Le cri se lance automatiquement</p>
      </div>
    </div>

    <p v-else class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center text-slate-400">
      Ce Pokémon est introuvable.
    </p>
  </main>
</template>