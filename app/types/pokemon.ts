import type { PokemonType } from './pokemonType'

export interface PokemonMove {
    name: string
    nameFr: string | null
    type: string
    power: number
    accuracy: number | null
    damageClass: string
}

export interface Pokemon {
    id: number
    name: string
    nameFr?: string | null
    height: number
    weight: number
    image?: string
    defaultImage?: string
    types?: PokemonType[]
    hp?: number | null
    attack?: number | null
    defense?: number | null
    specialAttack?: number | null
    specialDefense?: number | null
    speed?: number | null
    moves?: PokemonMove[] | null
}
