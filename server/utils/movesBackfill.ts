import prisma from './prisma'

export interface BattleMove {
    name: string
    nameFr: string | null
    type: string
    power: number
    accuracy: number | null
    damageClass: string
}

const MAX_MOVES = 4

const FALLBACK_MOVE: BattleMove = {
    name: 'tackle',
    nameFr: 'Charge',
    type: 'normal',
    power: 40,
    accuracy: 100,
    damageClass: 'physical',
}

export async function ensurePokemonMoves(name: string) {
    const pokemon = await prisma.pokemon.findUnique({ where: { name } })
    if (!pokemon) return null

    if (Array.isArray(pokemon.moves) && pokemon.moves.length > 0) {
        return pokemon
    }

    const moves = await fetchBattleMoves(name)

    return prisma.pokemon.update({
        where: { id: pokemon.id },
        data: { moves: moves as any },
    })
}

async function fetchBattleMoves(name: string): Promise<BattleMove[]> {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    if (!res.ok) return [FALLBACK_MOVE]

    const data = await res.json()

    const levelUpCandidates = (data.moves as any[])
        .map((m) => {
            const detail = m.version_group_details.find((d: any) => d.move_learn_method?.name === 'level-up')
            return detail ? { url: m.move.url as string, level: detail.level_learned_at as number } : null
        })
        .filter((m): m is { url: string; level: number } => m !== null)
        .sort((a, b) => a.level - b.level)
        .slice(0, 20)

    const fetched = await Promise.all(levelUpCandidates.map((candidate) => fetchMoveIfDamaging(candidate.url)))
    const damaging = fetched.filter((m): m is BattleMove => m !== null).slice(0, MAX_MOVES)

    return damaging.length > 0 ? damaging : [FALLBACK_MOVE]
}

async function fetchMoveIfDamaging(url: string): Promise<BattleMove | null> {
    try {
        const res = await fetch(url)
        if (!res.ok) return null
        const data = await res.json()

        if (data.damage_class?.name === 'status' || !data.power) return null

        const nameFr = data.names?.find((n: any) => n.language?.name === 'fr')?.name ?? null

        return {
            name: data.name,
            nameFr,
            type: data.type?.name ?? 'normal',
            power: data.power,
            accuracy: data.accuracy ?? null,
            damageClass: data.damage_class.name,
        }
    } catch {
        return null
    }
}
