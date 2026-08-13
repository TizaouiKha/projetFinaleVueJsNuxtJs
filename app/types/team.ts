import type { Pokemon } from "./pokemon"

export interface Team {
    id: number
    pokemons: Pokemon[]
    createdAt: string
}
