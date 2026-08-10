import type { PokemonType } from './pokemonType'

export interface Pokemon {
    id: number
    name: string
    nameFr?: string | null
    height: number
    weight: number
    image?: string
    types?: PokemonType[]
}