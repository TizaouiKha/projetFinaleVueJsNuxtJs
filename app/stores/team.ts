import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Pokemon } from '../types/pokemon'

export const MAX_TEAM_SIZE = 6
export const TEAM_STORAGE_KEY = 'pokemon-team'

export const useTeamStore = defineStore('team', () => {
    const team = ref<Pokemon[]>([])

    const teamCount = computed(() => team.value.length)
    const isFull = computed(() => team.value.length >= MAX_TEAM_SIZE)

    const isInTeam = (pokemonId: number) => team.value.some((p) => p.id === pokemonId)

    const addToTeam = (pokemon: Pokemon) => {
        if (isFull.value || isInTeam(pokemon.id)) return false
        team.value.push(pokemon)
        return true
    }

    const removeFromTeam = (pokemonId: number) => {
        team.value = team.value.filter((p) => p.id !== pokemonId)
    }

    const toggleInTeam = (pokemon: Pokemon) => {
        if (isInTeam(pokemon.id)) {
            removeFromTeam(pokemon.id)
            return false
        }
        return addToTeam(pokemon)
    }

    const clearTeam = () => {
        team.value = []
    }

    return {
        team,
        teamCount,
        isFull,
        isInTeam,
        addToTeam,
        removeFromTeam,
        toggleInTeam,
        clearTeam,
    }
})
