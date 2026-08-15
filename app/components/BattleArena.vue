<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useLocale } from '../composables/useLocale'
import { useBattleStore } from '../stores/battle'
import type { BattlePokemon } from '../composables/useBattleEngine'

const emit = defineEmits<{
    (e: 'new-battle'): void
}>()

const { t, typeName } = useLocale()
const battleStore = useBattleStore()

const logContainer = ref<HTMLElement | null>(null)

watch(
    () => battleStore.log.length,
    async () => {
        await nextTick()
        if (logContainer.value) {
            logContainer.value.scrollTop = logContainer.value.scrollHeight
        }
    },
)

const hpRatio = (pokemon: BattlePokemon | null) => (pokemon ? Math.max(0, pokemon.currentHp / pokemon.maxHp) : 0)

const hpColor = (pokemon: BattlePokemon | null) => {
    const ratio = hpRatio(pokemon)
    if (ratio > 0.5) return 'bg-emerald-400'
    if (ratio > 0.2) return 'bg-yellow-400'
    return 'bg-red-500'
}

const displayName = (pokemon: BattlePokemon | null) => (pokemon ? (pokemon.nameFr ?? pokemon.name) : '')

const benchOptions = computed(() => battleStore.playerTeam.filter((p) => !p.fainted))
</script>

<template>
    <div class="space-y-4">
        <button
            type="button"
            class="w-fit rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
            @click="emit('new-battle')"
        >
            {{ t('battle_back_to_setup') }}
        </button>

        <div class="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <p class="mb-4 text-center text-sm uppercase tracking-[0.3em] text-slate-400">
                {{ t('battle_vs') }} · {{ battleStore.opponentLabel }}
            </p>

            <div class="grid gap-6 sm:grid-cols-2">
                <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div class="flex items-center justify-between">
                        <p class="font-semibold capitalize">{{ displayName(battleStore.opponentActive) }}</p>
                        <p class="text-xs text-slate-400">{{ battleStore.opponentActive?.currentHp ?? 0 }} / {{ battleStore.opponentActive?.maxHp ?? 0 }}</p>
                    </div>
                    <div class="mt-2 h-2 rounded-full bg-slate-800">
                        <div class="h-2 rounded-full transition-all" :class="hpColor(battleStore.opponentActive)" :style="{ width: `${hpRatio(battleStore.opponentActive) * 100}%` }" />
                    </div>
                    <div class="mt-3 flex justify-center">
                        <img
                            v-if="battleStore.opponentActive"
                            :src="battleStore.opponentActive.image || battleStore.opponentActive.defaultImage || ''"
                            :alt="battleStore.opponentActive.name"
                            class="h-28 w-28 object-contain"
                            :class="{ 'grayscale opacity-40': battleStore.opponentActive.fainted }"
                        />
                    </div>
                </div>

                <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div class="flex items-center justify-between">
                        <p class="font-semibold capitalize">{{ displayName(battleStore.playerActive) }}</p>
                        <p class="text-xs text-slate-400">{{ battleStore.playerActive?.currentHp ?? 0 }} / {{ battleStore.playerActive?.maxHp ?? 0 }}</p>
                    </div>
                    <div class="mt-2 h-2 rounded-full bg-slate-800">
                        <div class="h-2 rounded-full transition-all" :class="hpColor(battleStore.playerActive)" :style="{ width: `${hpRatio(battleStore.playerActive) * 100}%` }" />
                    </div>
                    <div class="mt-3 flex justify-center">
                        <img
                            v-if="battleStore.playerActive"
                            :src="battleStore.playerActive.image || battleStore.playerActive.defaultImage || ''"
                            :alt="battleStore.playerActive.name"
                            class="h-28 w-28 object-contain"
                            :class="{ 'grayscale opacity-40': battleStore.playerActive.fainted }"
                        />
                    </div>
                </div>
            </div>

            <div
                ref="logContainer"
                class="mt-4 h-32 space-y-1 overflow-y-auto rounded-xl border border-slate-800 bg-black/40 p-3 text-sm text-slate-300"
            >
                <p v-for="(entry, index) in battleStore.log" :key="index">{{ entry }}</p>
            </div>

            <div v-if="battleStore.phase === 'finished'" class="mt-4 space-y-3 text-center">
                <p class="text-2xl font-black" :class="battleStore.winner === 'player' ? 'text-emerald-400' : 'text-red-400'">
                    {{ battleStore.winner === 'player' ? t('battle_victory') : t('battle_defeat') }}
                </p>
                <button
                    type="button"
                    class="rounded-full border border-cyan-500 bg-cyan-950/40 px-6 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-900/50"
                    @click="emit('new-battle')"
                >
                    {{ t('battle_new') }}
                </button>
            </div>

            <div v-else-if="battleStore.awaitingSwitch === 'player'" class="mt-4 space-y-2">
                <p class="text-center text-sm text-slate-300">{{ t('battle_choose_next') }}</p>
                <div class="flex flex-wrap justify-center gap-2">
                    <button
                        v-for="pokemon in benchOptions"
                        :key="pokemon.id"
                        type="button"
                        class="flex flex-col items-center gap-1 rounded-xl border border-slate-700 bg-slate-900/80 p-3 transition hover:bg-slate-800"
                        @click="battleStore.switchPlayerPokemon(battleStore.playerTeam.indexOf(pokemon))"
                    >
                        <img :src="pokemon.image || pokemon.defaultImage || ''" :alt="pokemon.name" class="h-14 w-14 object-contain" />
                        <span class="text-xs capitalize">{{ displayName(pokemon) }}</span>
                    </button>
                </div>
            </div>

            <div v-else class="mt-4 space-y-2">
                <p class="text-center text-sm text-slate-300">{{ t('battle_choose_move') }}</p>
                <div class="grid grid-cols-2 gap-2">
                    <button
                        v-for="(move, index) in battleStore.playerActive?.moves ?? []"
                        :key="`${move.name}-${index}`"
                        type="button"
                        class="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-left text-sm transition hover:bg-slate-800"
                        @click="battleStore.chooseMove(index)"
                    >
                        <span class="block font-semibold capitalize">{{ move.nameFr ?? move.name }}</span>
                        <span class="text-xs text-slate-400">{{ typeName(move.type) }} · {{ t('move_power') }} {{ move.power }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
