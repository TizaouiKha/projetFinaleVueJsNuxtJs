<script setup lang="ts">
import PokemonList from '~/components/PokemonList.vue'
import { useLocale } from '~/composables/useLocale'

const props = defineProps<{
  details: any
  typeName: string
}>()

const { t, typeName: translateTypeName } = useLocale()
</script>

<template>
  <div class="space-y-4">
    <div v-if="!details" class="text-slate-300">{{ t('loading_type_details') }}</div>

    <div v-else>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
          <h3 class="text-lg font-semibold">{{ t('resistances') }}</h3>
          <ul class="mt-3 space-y-1 text-sm text-slate-200">
            <li v-for="item in details.damage_relations.double_damage_from" :key="item.name">{{ t('double_damage_received', translateTypeName(item.name)) }}</li>
            <li v-if="details.damage_relations.double_damage_from.length === 0" class="text-slate-400">{{ t('no_strong_resistance') }}</li>
          </ul>
        </div>

        <div class="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
          <h3 class="text-lg font-semibold">{{ t('weaknesses') }}</h3>
          <ul class="mt-3 space-y-1 text-sm text-slate-200">
            <li v-for="item in details.damage_relations.double_damage_to" :key="item.name">{{ t('double_damage_dealt', translateTypeName(item.name)) }}</li>
            <li v-if="details.damage_relations.double_damage_to.length === 0" class="text-slate-400">{{ t('no_strong_weakness') }}</li>
          </ul>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
        <h3 class="text-lg font-semibold">{{ t('pokemon_of_type', translateTypeName(typeName)) }}</h3>
        <p class="mt-2 text-sm text-slate-400">
          {{ t('pokemon_referenced', details.pokemon.length) }}
        </p>
      </div>

      <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
        <PokemonList
          :initialType="typeName"
          :showTypeFilter="false"
          :showSearch="false"
          :title="t('pokemon_of_this_type_title')"
          :description="t('pokemon_of_this_type_description')"
        />
      </div>
    </div>
  </div>
</template>
