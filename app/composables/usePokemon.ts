import { ref, computed, toRefs } from 'vue'
import type { Pokemon } from '../types/pokemon'
import type { PokemonType } from '../types/pokemonType'
import { useListStore } from '../stores/list'

export function usePokemon(isTypePage = false) {
    const listStore = useListStore();
    const state = isTypePage ? listStore.type : listStore.home;

    const {
        currentPage,
        itemsPerPage,
        totalItems,
        searchQuery,
        selectedType,
    } = toRefs(state);

    const totalPages = computed(() =>
        Math.max(
            1,
            Math.ceil(totalItems.value / itemsPerPage.value)
        )
    )
    const allPokemons = ref<Pokemon[]>([])
    const types = ref<PokemonType[]>([])

    const fetchPage = async (page = 1, type?: string | null) => {
        try {
            if (type !== undefined) {
                selectedType.value = type
            }

            const limit = itemsPerPage.value
            const offset = Math.max(0, (page - 1) * limit)
            const params = new URLSearchParams()
            params.set('limit', String(limit))
            params.set('offset', String(offset))
            if (selectedType.value) params.set('type', selectedType.value)
            if (searchQuery.value) params.set('search', searchQuery.value)

            const res = await $fetch<{ data: Pokemon[]; total: number }>(`/api/pokemon?${params.toString()}`)

            allPokemons.value = res.data ?? []
            totalItems.value = res.total ?? allPokemons.value.length
            currentPage.value = page
        } catch (err) {
            console.error(err)
        }
    }

    const fetchTypes = async () => {
        try {
            types.value = await $fetch<PokemonType[]>('/api/types')
        } catch (err) {
            console.error(err)
        }
    }

    const fetchPokemonsByType = async (type: string | null) => {
        selectedType.value = type
        currentPage.value = 1
        await fetchPage(1, type)
    }

    const nextPage = async () => {
        if (currentPage.value >= totalPages.value) {
            return
        }
        await fetchPage(currentPage.value + 1)
    }

    const previousPage = async () => {
        if (currentPage.value <= 1) {
            return
        }

        await fetchPage(currentPage.value - 1)
    }


    return {
        allPokemons,
        fetchPage,
        fetchAllPokemons: () => fetchPage(1),
        types,
        totalPages,
        itemsPerPage,
        fetchTypes,
        fetchPokemonsByType,
        currentPage,
        total: totalItems,
        search: searchQuery,
        selectedType,
        nextPage,
        previousPage,
    }
}
