<script setup lang="ts">
import { useTeamStore } from '~/stores/team'
import { useLocale } from '~/composables/useLocale'

const teamStore = useTeamStore()
const { locale, toggleLocale, t } = useLocale()
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <nav class="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
      <NuxtLink to="/" class="text-sm font-bold uppercase tracking-[0.3em] text-slate-300 hover:text-white">
        {{ t('nav_pokedex') }}
      </NuxtLink>

      <div class="flex items-center gap-3">
        <button
          class="rounded-full border border-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:bg-slate-800"
          :title="locale === 'fr' ? 'Switch to English' : 'Passer en français'"
          @click="toggleLocale"
        >
          {{ locale === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN' }}
        </button>

        <NuxtLink
          to="/team"
          class="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
        >
          {{ t('nav_team', teamStore.teamCount) }}
        </NuxtLink>
      </div>
    </nav>

    <NuxtPage />
  </div>
</template>
