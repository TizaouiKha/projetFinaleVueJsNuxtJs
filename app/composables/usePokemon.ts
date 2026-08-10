import { ref, computed } from 'vue'
import type { Pokemon } from '../types/pokemon'
import type { PokemonType } from '../types/pokemonType'

export function usePokemon() {
    const allPokemons = ref<Pokemon[]>([])
    const types = ref<PokemonType[]>([])
    const itemsPerPage = ref(20)
    const currentPage = ref(1)
    const total = ref(0)
    const search = ref('')
    const selectedType = ref<string | null>(null)

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
            if (search.value) params.set('search', search.value)

            const response = await fetch(`/api/pokemon?${params.toString()}`)

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des Pokémon')
            }

            const res = await response.json()
            allPokemons.value = res.data ?? []
            total.value = res.total ?? allPokemons.value.length
            currentPage.value = page
        } catch (err) {
            console.error(err)
        }
    }

    const totalPages = computed(() => Math.max(1, Math.ceil(total.value / itemsPerPage.value)))

    const fetchTypes = async () => {
        try {
            const response = await fetch('/api/types')

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des types')
            }

            const data = await response.json()
            types.value = data
        } catch (err) {
            console.error(err)
        }
    }

    const fetchPokemonsByType = async (type: string | null) => {
        await fetchPage(1, type)
    }

    const nextPage = async () => {
        if (currentPage.value < totalPages.value) {
            await fetchPage(currentPage.value + 1)
        }
    }

    const previousPage = async () => {
        if (currentPage.value > 1) {
            await fetchPage(currentPage.value - 1)
        }
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
        total,
        search,
        nextPage,
        previousPage,
    }
}