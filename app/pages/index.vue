<script setup lang="ts">
import { useLocale } from '~/composables/useLocale'

const { t } = useLocale()
</script>

<template>
    <main class="min-h-screen bg-slate-950 text-white p-6">
        <div class="mx-auto max-w-7xl space-y-6">
            <p class="text-sm uppercase tracking-[0.3em] text-slate-400">{{ t('nav_pokedex') }}</p>
            <PokemonList
                :title="t('home_title')"
                :description="t('home_description')"
            />
        </div>
    </main>
</template>
