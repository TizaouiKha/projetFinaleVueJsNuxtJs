<script setup lang="ts">
import { onMounted } from 'vue'
import { useTeam } from '~/composables/useTeam'
import { useLocale } from '~/composables/useLocale'
import TeamsDatatable from '~/components/TeamsDatatable.vue'

const { allTeams, fetchTeams } = useTeam()
const { t } = useLocale()

onMounted(async () => {
    await fetchTeams()
})
</script>

<template>
    <main class="min-h-screen bg-slate-950 text-white p-6">
        <div class="mx-auto max-w-5xl space-y-6">
            <header class="space-y-2">
                <p class="text-sm uppercase tracking-[0.3em] text-slate-400">{{ t('nav_teams') }}</p>
                <h1 class="text-3xl font-bold">{{ t('saved_teams_title') }}</h1>
                <p class="text-slate-400">{{ t('saved_teams_description') }}</p>
            </header>

            <TeamsDatatable :teams="allTeams" />
        </div>
    </main>
</template>
