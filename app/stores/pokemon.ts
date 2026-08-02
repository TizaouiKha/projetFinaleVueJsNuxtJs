import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Pokemon } from '../types/pokemon'
import type { PokemonType } from '../types/pokemonType'

export const usePokemonStore = defineStore('pokemon', () => {
    const allPokemons = ref<Pokemon[]>([])
    const types = ref<PokemonType[]>([])
    const selectedType = ref<string | null>(null)
    const search = ref<string>('')
    const currentPage = ref(1)
    const itemsPerPage = ref(20)
    const selectedPokemon = ref<Pokemon | null>(null)
    const loadingPokemon = ref(false)

    const loadAllPokemons = async () => {
        try {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon?limit=2000`
            )

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des Pokémon')
            }

            const data = await response.json()

            const pokemons = await Promise.all(
                data.results.map(async (pokemon: { name: string }) => {
                    const response = await fetch(
                        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
                    )

                    const details = await response.json()

                    return {
                        id: details.id,
                        name: details.name,
                        height: details.height,
                        weight: details.weight,
                        image: details.sprites.other.showdown.front_default,
                        types: details.types.map((t: any) => t.type)
                    } satisfies Pokemon
                })
            )

            allPokemons.value = pokemons
        } catch (err) {
            console.error(err)
        }
    }

    const loadTypes = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/type')

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des types')
            }

            const data = await response.json()
            types.value = data.results
        } catch (err) {
            console.error(err)
        }
    }

    const loadPokemonDetails = async (pokemonName: string) => {
        loadingPokemon.value = true

        try {
            const cachedPokemon = allPokemons.value.find((pokemon) => pokemon.name === pokemonName)

            if (cachedPokemon) {
                selectedPokemon.value = cachedPokemon
                return
            }

            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)

            if (!response.ok) {
                throw new Error('Pokémon introuvable')
            }

            const details = await response.json()

            selectedPokemon.value = {
                id: details.id,
                name: details.name,
                height: details.height,
                weight: details.weight,
                image: details.sprites.other.showdown.front_default,
                types: details.types.map((t: any) => t.type)
            }
        } catch (err) {
            console.error(err)
            selectedPokemon.value = null
        } finally {
            loadingPokemon.value = false
        }
    }

    const filteredPokemons = computed(() => {
        const normalizedSearch = search.value.toLowerCase()

        return allPokemons.value.filter((pokemon: Pokemon) => {
            const matchesSearch = pokemon.name.toLowerCase().includes(normalizedSearch)

            const matchesType =
                !selectedType.value ||
                pokemon.types!.some((type: PokemonType) => type.name === selectedType.value)

            return matchesSearch && matchesType
        })
    })

    const totalPages = computed(() => {
        return Math.max(1, Math.ceil(filteredPokemons.value.length / itemsPerPage.value))
    })

    const paginatedPokemons = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value
        const end = start + itemsPerPage.value
        return filteredPokemons.value.slice(start, end)
    })

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value += 1
        }
    }

    const previousPage = () => {
        if (currentPage.value > 1) {
            currentPage.value -= 1
        }
    }

    const setSelectedType = (type: string | null) => {
        selectedType.value = type
        currentPage.value = 1
    }

    const setSearch = (value: string) => {
        search.value = value
        currentPage.value = 1
    }

    const setPage = (page: number) => {
        currentPage.value = Math.min(Math.max(1, page), totalPages.value)
    }

    const setItemsPerPage = (value: number) => {
        itemsPerPage.value = value
        currentPage.value = 1
    }

    return {
        allPokemons,
        types,
        selectedPokemon,
        loadingPokemon,
        loadAllPokemons,
        loadTypes,
        loadPokemonDetails,
        filteredPokemons,
        paginatedPokemons,
        totalPages,
        currentPage,
        itemsPerPage,
        nextPage,
        previousPage,
        setPage,
        setItemsPerPage,
        selectedType,
        setSelectedType,
        search,
        setSearch
    }
})