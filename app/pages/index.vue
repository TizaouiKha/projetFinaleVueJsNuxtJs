<script setup lang="ts">
import { onMounted } from 'vue'
import { usePokemon } from '~/composables/usePokemon'

const { allPokemons, fetchPage, types, fetchTypes, totalPages, itemsPerPage, fetchPokemonsByType, currentPage, nextPage, previousPage, total, search } = usePokemon()

onMounted(async () => {
    await fetchTypes()
    await fetchPage(1)
})

const handleFilterByType = async (type: string | null) => {
    if (type) {
        await fetchPokemonsByType(type)
    } else {
        await fetchPage(1)
    }
}
</script>

<template>
    <main class="min-h-screen bg-slate-950 text-white p-6">
        <div class="mx-auto max-w-7xl space-y-6">
            <header class="space-y-2">
                <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Pokédex</p>
                <h1 class="text-3xl font-bold">Découvrez les Pokémon</h1>
                <p class="text-slate-400">Recherchez, filtrez par type et naviguez dans la liste.</p>
            </header>

            <section class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div class="flex flex-col gap-2">
                        <label for="search" class="text-sm text-slate-300">Rechercher</label>
                        <input
                            id="search"
                            v-model="search"
                            type="search"
                            placeholder="Nom du Pokémon"
                            class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400 md:w-80"
                            @input="fetchPage(1)"
                        />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="itemsPerPage" class="text-sm text-slate-300">Pokémon par page</label>
                        <select
                            id="itemsPerPage"
                            v-model="itemsPerPage"
                            class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                            @change="fetchPage(1)"
                        >
                            <option :value="8">8</option>
                            <option :value="12">12</option>
                            <option :value="16">16</option>
                            <option :value="20">20</option>
                        </select>
                    </div>
                </div>

                <div class="mt-4">
                    <TypesGrid :types="types" @filter-by-type="handleFilterByType" />
                </div>
            </section>

            <section v-if="allPokemons.length" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <PokedexCard
                    v-for="pokemon in allPokemons"
                    :key="pokemon.id"
                    :pokemon="pokemon"
                />
            </section>

            <p v-else class="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center text-slate-400">
                Chargement des Pokémon...
            </p>

            <footer v-if="total > 0" class="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                    class="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="currentPage === 1"
                    @click="previousPage"
                >
                    Précédent
                </button>

                <span class="text-sm text-slate-300">
                    Page {{ currentPage }} / {{ totalPages }}
                </span>

                <button
                    class="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="currentPage === totalPages"
                    @click="nextPage"
                >
                    Suivant
                </button>
            </footer>
        </div>
    </main>
</template>