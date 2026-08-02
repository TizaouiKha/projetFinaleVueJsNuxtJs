import type { PokemonType } from './pokemonType'

export interface Pokemon {
    id: number
    name: string
    height: number
    weight: number
    image?: string
    types?: PokemonType[]
}