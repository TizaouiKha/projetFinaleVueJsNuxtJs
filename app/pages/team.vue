<script setup lang="ts">
import { useLocale } from '~/composables/useLocale'

const { t } = useLocale()
</script>

<template>
    <main class="min-h-screen bg-slate-950 text-white p-6">
        <div class="mx-auto max-w-7xl space-y-6">
            <NuxtLink to="/" class="w-fit rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 inline-block">
                {{ t('back_to_pokedex') }}
            </NuxtLink>

            <TeamBuilder />
        </div>
    </main>
</template>
