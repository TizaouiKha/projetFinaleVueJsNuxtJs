<script setup lang="ts">
import { computed, watch } from 'vue'
import { pokemonTypeColors } from "~/utils/pokemonTypeColors";
import { useLocale } from "~/composables/useLocale";
import { useTypeDetails } from '@/composables/useTypeDetails';
import TypeDetails from '~/components/TypeDetails.vue'
const route = useRoute()

const { typeDetails, fetchTypeDetails } = useTypeDetails()
const { t, typeName } = useLocale()
const type = computed(() => typeof route.params.name === 'string' ? route.params.name : '')

watch(
  () => type.value,
  async (newType) => {
    if (newType) {
      await fetchTypeDetails(newType)
    }
  },
  { immediate: true }
)
</script>
<template>
    <main class="min-h-screen bg-slate-950 text-white p-6">
        <div class="mx-auto max-w-7xl space-y-6">
            <header class="space-y-2">
                <p class="text-sm uppercase tracking-[0.3em] text-slate-400">{{ t('type_label') }}</p>
                <h1 class="text-3xl font-bold">{{ t('type_details_title', typeName(type)) }}</h1>
            </header>
            <section class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
                <div v-if="type" :class="pokemonTypeColors[type]" class="p-4 rounded-lg">
                    <h2 class="text-xl font-semibold">{{ t('type_info_title', typeName(type)) }}</h2>
                    <TypeDetails :details="typeDetails" :typeName="type" />
                </div>
                <div v-else>
                    <p>{{ t('type_not_specified') }}</p>
                </div>
            </section>
        </div>
    </main>
</template>
