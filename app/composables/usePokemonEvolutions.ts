import { ref } from 'vue'

export function usePokemonEvolutions() {
    const beforeEvolution = ref<string | null>('')
    const afterEvolution = ref<string | null>('')
    const beforeEvolutionFr = ref<string | null>(null)
    const afterEvolutionFr = ref<string | null>(null)
    const moves = ref<any[]>([])

    const fetchNameFr = async (name: string): Promise<string | null> => {
        try {
            const res = await fetch(`/api/pokemon/${encodeURIComponent(name)}`)
            if (!res.ok) return null
            const data = await res.json()
            return data?.nameFr ?? null
        } catch {
            return null
        }
    }

    const getPokemonEvolutions = async (pokemonId: number) => {
        beforeEvolution.value = ''
        afterEvolution.value = ''
        beforeEvolutionFr.value = null
        afterEvolutionFr.value = null

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
        const data = await response.json()

        if (data.evolves_from_species) {
            beforeEvolution.value = data.evolves_from_species.name
            beforeEvolutionFr.value = await fetchNameFr(beforeEvolution.value)
        }

        if (data.evolution_chain) {
            const evolutionResponse = await fetch(data.evolution_chain.url)
            const evolutionData = await evolutionResponse.json()
            const evolutions = getEvolutions(evolutionData.chain)

            const currentIndex = evolutions.findIndex((e) => e.species.name === data.name)

            if (currentIndex >= 0 && currentIndex < evolutions.length - 1) {
                afterEvolution.value = evolutions[currentIndex + 1].species.name
                afterEvolutionFr.value = await fetchNameFr(afterEvolution.value)
            } else {
                afterEvolution.value = 'aucune'
            }
        } else {
            afterEvolution.value = 'aucune'
        }
    }

    const getEvolutions = (chain: any): any[] => {
        const evolutions: any[] = []
        let currentChain: any = chain

        while (currentChain) {
            evolutions.push(currentChain)
            currentChain = currentChain.evolves_to[0]
        }

        return evolutions
    }

    const getMoves = async (pokemonName: string) => {
        moves.value = []
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        const data = await response.json()

        moves.value = data.moves.map((move: any) => move.move.name)
    }



    return {
        beforeEvolution,
        afterEvolution,
        beforeEvolutionFr,
        afterEvolutionFr,
        moves,
        getPokemonEvolutions,
        getMoves
    }
}
