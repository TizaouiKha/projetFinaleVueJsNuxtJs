import type { Pokemon } from "./pokemon"

export interface Team {
    id: number
    name?: string | null
    pokemons: Pokemon[]
    createdAt: string
}
