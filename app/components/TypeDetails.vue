<script setup lang="ts">
import PokemonList from '~/components/PokemonList.vue'
import { useLocale } from '~/composables/useLocale'

const props = defineProps<{
  details: any
  typeName: string
}>()

onMounted(() => {
  console.log(props);
})

const { t, typeName: translateTypeName } = useLocale()
</script>

<template>
  <div class="space-y-4">
    <div v-if="!details" class="text-slate-300">{{ t('loading_type_details') }}</div>

    <div v-else>
      <div class="grid gap-4 md:grid-cols-2">
        <div v-if="details.damage_relations.double_damage_from.length >= 1" class="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
          <h3 class="text-lg font-semibold">{{ t('weak_against') }}</h3>
          <ul class="mt-3 space-y-1 text-sm text-slate-200 flex flex-wrap gap-3">
            <li v-for="item in details.damage_relations.double_damage_from" :key="item.name"><TypeTag :type="item.name"/></li>
          </ul>
        </div>

        <div v-if="details.damage_relations.double_damage_to.length >= 1" class="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
          <h3 class="text-lg font-semibold">{{ t('super_effective_against') }}</h3>
          <ul class="mt-3 space-y-1 text-sm text-slate-200 flex flex-wrap gap-3">
            <li v-for="item in details.damage_relations.double_damage_to" :key="item.name"><TypeTag :type="item.name"/></li>
          </ul>
        </div>

        <div v-if="details.damage_relations.half_damage_from.length >= 1" class="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
          <h3 class="text-lg font-semibold">{{ t('resistant_to') }}</h3>
          <ul class="mt-3 space-y-1 text-sm text-slate-200 flex flex-wrap gap-3">
            <li v-for="item in details.damage_relations.half_damage_from" :key="item.name"><TypeTag :type="item.name"/></li>
          </ul>
        </div>

        <div v-if="details.damage_relations.half_damage_to.length >= 1" class="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
          <h3 class="text-lg font-semibold">{{ t('not_very_effective_against') }}</h3>
          <ul class="mt-3 space-y-1 text-sm text-slate-200 flex flex-wrap gap-3">
            <li v-for="item in details.damage_relations.half_damage_to" :key="item.name"><TypeTag :type="item.name"/></li>
          </ul>
        </div>

        <div v-if="details.damage_relations.no_damage_from.length >= 1" class="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
          <h3 class="text-lg font-semibold">{{ t('immune_to') }}</h3>
          <ul class="mt-3 space-y-1 text-sm text-slate-200 flex flex-wrap gap-3">
            <li v-for="item in details.damage_relations.no_damage_from" :key="item.name"><TypeTag :type="item.name"/></li>
          </ul>
        </div>
        
        <div v-if="details.damage_relations.no_damage_to.length >= 1" class="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
          <h3 class="text-lg font-semibold">{{ t('no_effect_against') }}</h3>
          <ul class="mt-3 space-y-1 text-sm text-slate-200 flex flex_wrap gap-3">
            <li v-for="item in details.damage_relations.no_damage_to" :key="item.name"><TypeTag :type="item.name"/></li>
          </ul>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg mt-4">
        <PokemonList
          :initialType="typeName"
          :showTypeFilter="false"
          :showSearch="false"
          :isTypePage="true"
          :title="t('pokemon_of_this_type_title', translateTypeName(typeName))"
          :description="t('pokemon_of_this_type_description', translateTypeName(typeName))"
        />
      </div>
    </div>
  </div>
</template>
