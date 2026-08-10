<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { usePokemon } from '~/composables/usePokemon'
import TypesGrid from '~/components/TypesGrid.vue'
import PokedexCard from '~/components/PokedexCard.vue'

const props = defineProps({
  initialType: {
    type: String,
    default: null,
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  showTypeFilter: {
    type: Boolean,
    default: true,
  },
  showItemsPerPage: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'Liste des Pokémon',
  },
  description: {
    type: String,
    default: 'Recherchez, filtrez par type et naviguez dans la liste.',
  },
})

const {
  allPokemons,
  fetchPage,
  types,
  fetchTypes,
  totalPages,
  itemsPerPage,
  currentPage,
  total,
  search,
  nextPage,
  previousPage,
} = usePokemon()

const loading = ref(false)

const loadPage = async (page = 1, type?: string | null) => {
  loading.value = true
  try {
    await fetchPage(page, type)
  } finally {
    loading.value = false
  }
}

const handleFilterByType = async (type: string | null) => {
  await loadPage(1, type)
}

watch(
  () => props.initialType,
  async (newType) => {
    await loadPage(1, newType)
  },
  { immediate: true }
)

onMounted(async () => {
  if (props.showTypeFilter) {
    await fetchTypes()
  }
})
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Pokédex</p>
      <h1 class="text-3xl font-bold">{{ title }}</h1>
      <p class="text-slate-400">{{ description }}</p>
    </header>

    <section class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div v-if="props.showSearch" class="flex flex-col gap-2">
          <label for="search" class="text-sm text-slate-300">Rechercher</label>
          <input
            id="search"
            v-model="search"
            type="search"
            placeholder="Nom du Pokémon"
            class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400 md:w-80"
            @input="loadPage(1)"
          />
        </div>

        <div v-if="props.showItemsPerPage" class="flex flex-col gap-2">
          <label for="itemsPerPage" class="text-sm text-slate-300">Pokémon par page</label>
          <select
            id="itemsPerPage"
            v-model="itemsPerPage"
            class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            @change="loadPage(1)"
          >
            <option :value="8">8</option>
            <option :value="12">12</option>
            <option :value="16">16</option>
            <option :value="20">20</option>
          </select>
        </div>
      </div>

      <div v-if="props.showTypeFilter" class="mt-4">
        <TypesGrid :types="types" @filter-by-type="handleFilterByType" />
      </div>
    </section>

    <section class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <PokedexCard
        v-for="pokemon in allPokemons"
        :key="pokemon.id"
        :pokemon="pokemon"
      />
    </section>

    <div v-if="loading && !allPokemons.length" class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center text-slate-400">
      Chargement des Pokémon...
    </div>

    <div v-else-if="!loading && !allPokemons.length" class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center text-slate-400">
      Aucun Pokémon trouvé.
    </div>

    <footer v-if="props.showPagination && total > 0" class="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between">
      <button
        class="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="currentPage === 1"
        @click="previousPage()"
      >
        Précédent
      </button>

      <span class="text-sm text-slate-300">
        Page {{ currentPage }} / {{ totalPages }}
      </span>

      <button
        class="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="currentPage === totalPages"
        @click="nextPage()"
      >
        Suivant
      </button>
    </footer>
  </section>
</template>
