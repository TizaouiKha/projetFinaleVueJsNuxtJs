import type { PokemonType } from './pokemonType';
export interface PokemonEvolution {
    id: number
    name: string
    image: string
    types: PokemonType[]
}