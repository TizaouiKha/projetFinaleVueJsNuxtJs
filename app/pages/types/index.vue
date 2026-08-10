<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePokemon } from '@/composables/usePokemon'
import { useLocale } from '@/composables/useLocale'

const { types, fetchTypes } = usePokemon()
const { t } = useLocale()
fetchTypes()

const handleRedirect = (type: string) => {
    if (type) {
        window.location.href = `/types/${type}`
    } else {
        window.location.href = '/types'
    }
}
</script>

<template>
    <main class="min-h-screen bg-slate-950 text-white p-6">
        <div class="mx-auto max-w-7xl space-y-6">
            <header class="space-y-2">
                <p class="text-sm uppercase tracking-[0.3em] text-slate-400">{{ t('type_label') }}</p>
                <h1 class="text-3xl font-bold">{{ t('types_page_title') }}</h1>
                <p class="text-slate-400">{{ t('types_page_description') }}</p>
            </header>
            <section class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
                <TypesGrid :types="types" @redirect="handleRedirect"/>
            </section>
        </div>
    </main>
</template>
