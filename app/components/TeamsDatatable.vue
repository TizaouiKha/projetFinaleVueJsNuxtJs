<script setup lang="ts">
import type { Team } from '../types/team'
import { useTeam } from '../composables/useTeam'

const props = defineProps<{
  teams: Team[]
}>()

const { deleteTeam, deleteMessage } = useTeam();

</script>
<template>
  <section>
    <h2 class="text-2xl font-bold mb-4">
      Équipes existantes
    </h2>
    <p v-if="deleteMessage" class="text-sm text-slate-400">
        {{ deleteMessage }}
    </p>

    <ul class="space-y-4">
      <li
        v-for="team in teams"
        :key="team.id"
        class="rounded-2xl border border-slate-700 bg-slate-900/80 p-4"
      >
        <div class="mb-4 flex items-center justify-between">
          <p class="font-semibold text-slate-200">
            Team #{{ team.id }}
          </p>

          <button
            type="button"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
            @click="deleteTeam(team.id)"
          >
            Supprimer
          </button>
        </div>

        <ul class="flex flex-wrap gap-3">
          <li
            v-for="pokemon in team.pokemons"
            :key="pokemon.id"
            class="flex w-36 flex-col items-center rounded-xl bg-slate-800 p-3"
          >
            <img
              :src="pokemon.defaultImage"
              :alt="pokemon.name"
              class="h-20 w-20 object-contain"
            />

            <p class="mt-2 text-sm font-medium text-slate-200">
              {{ pokemon.nameFr }}
            </p>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>