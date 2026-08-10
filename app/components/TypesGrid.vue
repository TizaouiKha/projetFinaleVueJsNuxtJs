<script setup lang="ts">
import { useLocale } from "~/composables/useLocale";

const props = defineProps<{
    types: { name: string, url: string }[]
}>()

const emit = defineEmits<{
    (e: 'filterByType', type: string | null): void
    (e: 'redirect', type: string): void
}>()

const { t, typeName } = useLocale()

const setType = (type: string | null) => {
    emit('filterByType', type)
    emit('redirect', type ?? '')
}
</script>

<template>
    <div class="flex flex-col gap-3">
        <p v-if="props.types.length > 0" class="text-sm">
            {{ t('types_available') }}
        </p>

        <div class="flex flex-wrap gap-2">
            <button class="px-3 py-1 rounded border" @click="setType(null)">
                {{ t('all_types') }}
            </button>

            <button v-for="type in props.types" :key="type.name" class="px-3 py-1 rounded border"
                @click="setType(type.name)">
                {{ typeName(type.name) }}
            </button>
        </div>


    </div>
</template>
