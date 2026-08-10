import type { PokemonType } from './pokemonType'

export interface Pokemon {
    id: number
    name: string
    nameFr?: string | null
    height: number
    weight: number
    image?: string
    types?: PokemonType[]
    hp?: number | null
    attack?: number | null
    defense?: number | null
    specialAttack?: number | null
    specialDefense?: number | null
    speed?: number | null
}