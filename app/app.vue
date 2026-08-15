<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '~/composables/useLocale'
import AppSidebar from '~/components/AppSidebar.vue'

const { locale, toggleLocale, t } = useLocale()
const isSidebarOpen = ref(false)

const { loggedIn, clear } = useOidcAuth()

const handleLogout = async () => {
  await clear()
  await navigateTo('/auth/login')
}
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <nav class="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
      <div class="flex items-center gap-4">
        <button
          class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:bg-slate-800"
          aria-label="Ouvrir le menu"
          @click="isSidebarOpen = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <NuxtLink to="/" class="text-sm font-bold uppercase tracking-[0.3em] text-slate-300 hover:text-white">
          {{ t('nav_pokedex') }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="rounded-full border border-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:bg-slate-800"
          :title="locale === 'fr' ? 'Switch to English' : 'Passer en français'"
          @click="toggleLocale"
        >
          {{ locale === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN' }}
        </button>

        <button
          v-if="loggedIn"
          class="rounded-full border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800"
          @click="handleLogout"
        >
          {{ t('logout') }}
        </button>
      </div>
    </nav>

    <AppSidebar v-model="isSidebarOpen" />

    <NuxtPage />
  </div>
</template>
