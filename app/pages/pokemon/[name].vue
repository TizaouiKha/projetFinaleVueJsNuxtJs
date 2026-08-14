<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePokemonEvolutions } from '@/composables/usePokemonEvolutions'
import { useLocale } from '@/composables/useLocale'
import type { Pokemon } from '@/types/pokemon'

const route = useRoute()
const router = useRouter()
const { beforeEvolution, afterEvolution, beforeEvolutionFr, afterEvolutionFr, getPokemonEvolutions, getMoves, moves } = usePokemonEvolutions()
const { t } = useLocale()

const goBack = () => {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}

const selectedPokemon = ref<Pokemon | null>(null)
const loadingPokemon = ref(false)
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
        await getMoves(selectedPokemon.value.name)
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
        {{ t('loading_pokemon') }}
      </div>
    </div>

    <div v-else-if="selectedPokemon" class="mx-auto flex max-w-5xl flex-col gap-6">
      <button
        type="button"
        class="w-fit rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
        @click="goBack"
      >
        {{ t('back_to_list') }}
      </button>

      <PokemonDetailCard
        :pokemon="selectedPokemon"
        :before-evolution="beforeEvolution"
        :after-evolution="afterEvolution"
        :before-evolution-fr="beforeEvolutionFr"
        :after-evolution-fr="afterEvolutionFr"
      />
      <div class="flex items-center gap-3">
        <p v-if="cryAttempted && cryAutoplayFailed" class="text-sm text-slate-400">{{ t('cry_autoplay_blocked') }}</p>
        <p v-else-if="!cryAttempted" class="text-sm text-slate-400">{{ t('cry_autoplay_hint') }}</p>
      </div>
    </div>

    <p v-else class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center text-slate-400">
      {{ t('pokemon_not_found') }}
    </p>
  </main>
</template>