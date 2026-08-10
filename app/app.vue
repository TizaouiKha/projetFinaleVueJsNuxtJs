<script setup lang="ts">
import { useTeamStore } from '~/stores/team'

const teamStore = useTeamStore()
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <nav class="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
      <NuxtLink to="/" class="text-sm font-bold uppercase tracking-[0.3em] text-slate-300 hover:text-white">
        Pokédex
      </NuxtLink>

      <NuxtLink
        to="/team"
        class="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
      >
        Mon équipe ({{ teamStore.teamCount }}/6)
      </NuxtLink>
    </nav>

    <NuxtPage />
  </div>
</template>