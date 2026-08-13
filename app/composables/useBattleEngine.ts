import type { Pokemon, PokemonMove } from '../types/pokemon'
import { getTypeEffectiveness } from '../utils/typeEffectiveness'

export interface BattlePokemon {
    id: number
    name: string
    nameFr: string | null
    image: string | null
    defaultImage: string | null
    types: string[]
    moves: PokemonMove[]
    maxHp: number
    currentHp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
    fainted: boolean
}

export type Difficulty = 'easy' | 'medium' | 'hard'

const LEVEL = 50

const FALLBACK_MOVE: PokemonMove = {
    name: 'tackle',
    nameFr: 'Charge',
    type: 'normal',
    power: 40,
    accuracy: 100,
    damageClass: 'physical',
}

const computeStat = (base: number, isHp: boolean) => {
    const raw = Math.floor(((2 * base + 31) * LEVEL) / 100)
    return isHp ? raw + LEVEL + 10 : raw + 5
}

export const toBattlePokemon = (pokemon: Pokemon): BattlePokemon => {
    const maxHp = computeStat(pokemon.hp ?? 45, true)
    const moves = Array.isArray(pokemon.moves) && pokemon.moves.length > 0
        ? pokemon.moves
        : [FALLBACK_MOVE]

    return {
        id: pokemon.id,
        name: pokemon.name,
        nameFr: pokemon.nameFr ?? null,
        image: pokemon.image ?? null,
        defaultImage: pokemon.defaultImage ?? null,
        types: (pokemon.types as unknown as string[]) ?? [],
        moves,
        maxHp,
        currentHp: maxHp,
        attack: computeStat(pokemon.attack ?? 50, false),
        defense: computeStat(pokemon.defense ?? 50, false),
        specialAttack: computeStat(pokemon.specialAttack ?? 50, false),
        specialDefense: computeStat(pokemon.specialDefense ?? 50, false),
        speed: computeStat(pokemon.speed ?? 50, false),
        fainted: false,
    }
}

export const calculateDamage = (attacker: BattlePokemon, defender: BattlePokemon, move: PokemonMove) => {
    const isPhysical = move.damageClass === 'physical'
    const attackStat = isPhysical ? attacker.attack : attacker.specialAttack
    const defenseStat = isPhysical ? defender.defense : defender.specialDefense

    const stab = attacker.types.some((t) => t.toLowerCase() === move.type.toLowerCase()) ? 1.5 : 1
    const effectiveness = getTypeEffectiveness(move.type, defender.types)
    const randomFactor = 0.85 + Math.random() * 0.15

    const base = (((2 * LEVEL) / 5 + 2) * move.power * (attackStat / defenseStat)) / 50 + 2
    const damage = Math.max(1, Math.floor(base * stab * effectiveness * randomFactor))

    return { damage, effectiveness }
}

export const pickNpcMove = (pokemon: BattlePokemon, opponent: BattlePokemon, difficulty: Difficulty): PokemonMove => {
    if (difficulty === 'easy') {
        return pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)]
    }

    if (difficulty === 'medium') {
        return [...pokemon.moves].sort((a, b) => b.power - a.power)[0]
    }

    const scored = pokemon.moves.map((move) => ({
        move,
        score: move.power * getTypeEffectiveness(move.type, opponent.types),
    }))

    return scored.sort((a, b) => b.score - a.score)[0].move
}

export function useBattleEngine() {
    return {
        toBattlePokemon,
        calculateDamage,
        pickNpcMove,
    }
}
