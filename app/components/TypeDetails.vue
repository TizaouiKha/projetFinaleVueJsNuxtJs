<script setup lang="ts">
const props = defineProps<{
  details: any
  typeName: string
}>()
</script>

<template>
  <div class="space-y-4">
    <div v-if="!details" class="text-slate-300">Chargement des détails du type...</div>

    <div v-else>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
          <h3 class="text-lg font-semibold">Résistances</h3>
          <ul class="mt-3 space-y-1 text-sm text-slate-200">
            <li v-for="item in details.damage_relations.double_damage_from" :key="item.name">Double dégât reçu de {{ item.name }}</li>
            <li v-if="details.damage_relations.double_damage_from.length === 0" class="text-slate-400">Aucune résistance forte</li>
          </ul>
        </div>

        <div class="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
          <h3 class="text-lg font-semibold">Faiblesses</h3>
          <ul class="mt-3 space-y-1 text-sm text-slate-200">
            <li v-for="item in details.damage_relations.double_damage_to" :key="item.name">Double dégât infligé à {{ item.name }}</li>
            <li v-if="details.damage_relations.double_damage_to.length === 0" class="text-slate-400">Aucune faiblesse forte</li>
          </ul>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
        <h3 class="text-lg font-semibold">Pokémons du type {{ typeName }}</h3>
        <p class="mt-2 text-sm text-slate-400">
          Nombre de pokémons référencés dans l’API : {{ details.pokemon.length }}
        </p>
      </div>
    </div>
  </div>
</template>
