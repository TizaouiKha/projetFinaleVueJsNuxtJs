<script setup lang="ts">
const props = defineProps<{
    type: { name: string, url: string }
}>();

import { pokemonTypeColors } from "~/utils/pokemonTypeColors";
</script>
<template>
    <span class="border-white rounded-full px-3 py-1 text-white" :class="pokemonTypeColors[type]">
        {{ type }}
    </span>
</template>