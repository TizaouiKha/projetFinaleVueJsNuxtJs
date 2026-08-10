<script setup lang="ts">
const props = defineProps<{
    type?: string
}>();

import { pokemonTypeColors } from "~/utils/pokemonTypeColors";
import { useLocale } from "~/composables/useLocale";

const { typeName } = useLocale()
</script>
<template>
    <span class="border-white rounded-full px-3 py-1 text-white" :class="pokemonTypeColors[type]">
        {{ typeName(type) }}
    </span>
</template>
