<script setup lang="ts">
import { usePokemonStore } from '../stores/pokemon'

const pokemonStore = usePokemonStore()
const emit = defineEmits<{
    (e: 'filterByType', type: string | null): void
}>()

const setType = (type: string | null) => {
    pokemonStore.setSelectedType(type)
    emit('filterByType', type)
}

onMounted(async () => {
    if (pokemonStore.types.length === 0) {
        await pokemonStore.loadTypes()
    }
})
</script>

<template>
    <div class="flex flex-col gap-3">
        <p v-if="pokemonStore.selectedType" class="text-sm">
            Type sélectionné : {{ pokemonStore.selectedType }}
        </p>

        <div class="flex flex-wrap gap-2">
            <button
                class="px-3 py-1 rounded border"
                :class="pokemonStore.selectedType === null ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'"
                @click="setType(null)"
            >
                Tous
            </button>

            <button
                v-for="type in pokemonStore.types"
                :key="type.name"
                class="px-3 py-1 rounded border"
                :class="pokemonStore.selectedType === type.name ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'"
                @click="setType(type.name)"
            >
                {{ type.name }}
            </button>
        </div>
    </div>
</template>