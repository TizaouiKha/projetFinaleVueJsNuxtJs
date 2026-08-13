import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Pokemon, PokemonMove } from '../types/pokemon'
import { type BattlePokemon, type Difficulty, calculateDamage, pickNpcMove, toBattlePokemon } from '../composables/useBattleEngine'

export type BattlePhase = 'idle' | 'active' | 'finished'
export type BattleSide = 'player' | 'opponent'

export const useBattleStore = defineStore('battle', () => {
    const playerTeam = ref<BattlePokemon[]>([])
    const opponentTeam = ref<BattlePokemon[]>([])
    const playerActiveIndex = ref(0)
    const opponentActiveIndex = ref(0)
    const opponentLabel = ref('')
    const isNpc = ref(true)
    const difficulty = ref<Difficulty>('medium')
    const log = ref<string[]>([])
    const phase = ref<BattlePhase>('idle')
    const winner = ref<BattleSide | null>(null)
    const awaitingSwitch = ref<BattleSide | null>(null)

    const playerActive = computed(() => playerTeam.value[playerActiveIndex.value] ?? null)
    const opponentActive = computed(() => opponentTeam.value[opponentActiveIndex.value] ?? null)

    const pushLog = (message: string) => {
        log.value.push(message)
    }

    const pokemonLabel = (pokemon: BattlePokemon) => pokemon.nameFr ?? pokemon.name

    const nextAliveIndex = (team: BattlePokemon[]) => team.findIndex((p) => !p.fainted)

    const startBattle = (
        playerPokemons: Pokemon[],
        opponentPokemons: Pokemon[],
        label: string,
        opts: { isNpc: boolean; difficulty: Difficulty },
    ) => {
        playerTeam.value = playerPokemons.map(toBattlePokemon)
        opponentTeam.value = opponentPokemons.map(toBattlePokemon)
        playerActiveIndex.value = 0
        opponentActiveIndex.value = 0
        opponentLabel.value = label
        isNpc.value = opts.isNpc
        difficulty.value = opts.difficulty
        log.value = [`Le combat commence contre ${label} !`]
        phase.value = 'active'
        winner.value = null
        awaitingSwitch.value = null
    }

    const applyAttack = (attackerSide: BattleSide, move: PokemonMove) => {
        const attacker = attackerSide === 'player' ? playerActive.value : opponentActive.value
        const defenderTeam = attackerSide === 'player' ? opponentTeam.value : playerTeam.value
        const defenderIndex = attackerSide === 'player' ? opponentActiveIndex.value : playerActiveIndex.value
        const defender = defenderTeam[defenderIndex]

        if (!attacker || !defender) return

        const { damage, effectiveness } = calculateDamage(attacker, defender, move)
        defender.currentHp = Math.max(0, defender.currentHp - damage)

        const moveLabel = move.nameFr ?? move.name
        let message = `${pokemonLabel(attacker)} utilise ${moveLabel} ! ${pokemonLabel(defender)} perd ${damage} PV.`
        if (effectiveness > 1) message += " C'est super efficace !"
        else if (effectiveness > 0 && effectiveness < 1) message += " Ce n'est pas très efficace..."
        else if (effectiveness === 0) message += " Ça n'affecte pas l'adversaire..."
        pushLog(message)

        if (defender.currentHp <= 0) {
            defender.fainted = true
            pushLog(`${pokemonLabel(defender)} est mis K.O. !`)
            handleFaint(attackerSide === 'player' ? 'opponent' : 'player')
        }
    }

    const handleFaint = (faintedSide: BattleSide) => {
        const faintedTeam = faintedSide === 'player' ? playerTeam.value : opponentTeam.value

        if (faintedTeam.every((p) => p.fainted)) {
            phase.value = 'finished'
            winner.value = faintedSide === 'player' ? 'opponent' : 'player'
            pushLog(winner.value === 'player' ? 'Tu remportes le combat !' : 'Tu as perdu le combat...')
            return
        }

        if (faintedSide === 'player') {
            awaitingSwitch.value = 'player'
            return
        }

        const nextIndex = nextAliveIndex(opponentTeam.value)
        if (nextIndex >= 0) {
            opponentActiveIndex.value = nextIndex
            pushLog(`${opponentLabel.value} envoie ${pokemonLabel(opponentTeam.value[nextIndex])} !`)
        }
    }

    const chooseMove = (moveIndex: number) => {
        if (phase.value !== 'active' || awaitingSwitch.value) return
        const player = playerActive.value
        const opponent = opponentActive.value
        if (!player || !opponent) return

        const playerMove = player.moves[moveIndex]
        if (!playerMove) return

        const opponentMove = pickNpcMove(opponent, player, difficulty.value)

        const order: BattleSide[] = player.speed >= opponent.speed
            ? ['player', 'opponent']
            : ['opponent', 'player']

        for (const side of order) {
            if (phase.value !== 'active') break
            const actingPokemon = side === 'player' ? playerActive.value : opponentActive.value
            if (!actingPokemon || actingPokemon.fainted) continue
            applyAttack(side, side === 'player' ? playerMove : opponentMove)
        }
    }

    const switchPlayerPokemon = (index: number) => {
        const target = playerTeam.value[index]
        if (!target || target.fainted) return
        playerActiveIndex.value = index
        awaitingSwitch.value = null
        pushLog(`Vas-y, ${pokemonLabel(target)} !`)
    }

    const resetBattle = () => {
        playerTeam.value = []
        opponentTeam.value = []
        playerActiveIndex.value = 0
        opponentActiveIndex.value = 0
        opponentLabel.value = ''
        log.value = []
        phase.value = 'idle'
        winner.value = null
        awaitingSwitch.value = null
    }

    return {
        playerTeam,
        opponentTeam,
        playerActiveIndex,
        opponentActiveIndex,
        opponentLabel,
        isNpc,
        difficulty,
        log,
        phase,
        winner,
        awaitingSwitch,
        playerActive,
        opponentActive,
        startBattle,
        chooseMove,
        switchPlayerPokemon,
        resetBattle,
    }
})
