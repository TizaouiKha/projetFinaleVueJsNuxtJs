<script setup lang="ts">
const props = defineProps<{
    type?: string
}>();

import { pokemonTypeColors } from "~/utils/pokemonTypeColors";
import { useLocale } from "~/composables/useLocale";


const router = useRouter()

const redirectTo = () => {
    if (props.type) {
        router.push(`/types/${props.type}`)
    }
}
const { typeName } = useLocale()
</script>
<template>
    <span @click="redirectTo" class="border-white rounded-full px-3 py-1 text-white cursor-pointer" :class="pokemonTypeColors[type]">
        {{ typeName(type) }}
    </span>
</template>
