<script setup lang="ts">
import { usePokemon } from '@/composables/usePokemon'
import { useTeamStore } from '../stores/team'
import { useLocale } from '../composables/useLocale'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const showTypes = ref(false);

const handleToggleShowItems = () => {
    if(showTypes.value) {
        showTypes.value = false;
    } else {
        showTypes.value = true;
    }
}

const { types, fetchTypes } = usePokemon()
const teamStore = useTeamStore()
const { t } = useLocale()
fetchTypes()

const close = () => {
    emit('update:modelValue', false)
    showTypes.value = false
}
</script>

<template>
    <div>
        <div
            v-if="modelValue"
            class="fixed inset-0 z-40 bg-black/60 transition-opacity"
            @click="close"
        />

        <aside
            class="fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-800 bg-slate-950 p-6 transition-transform duration-300 ease-in-out"
            :class="modelValue ? 'translate-x-0' : '-translate-x-full'"
        >
            <div class="flex items-center justify-between">
                <p class="text-sm font-bold uppercase tracking-[0.3em] text-slate-300">{{ t('nav_pokedex') }}</p>
                <button
                    class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:bg-slate-800"
                    aria-label="Fermer le menu"
                    @click="close"
                >
                    ✕
                </button>
            </div>

            <nav class="mt-8 flex flex-col gap-2">
                <NuxtLink
                    to="/"
                    class="rounded-lg border border-slate-800 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
                    active-class="border-slate-700 bg-slate-800 text-white"
                    @click="close"
                >
                    {{ t('nav_pokedex') }}
                </NuxtLink>

                <div class="rounded-lg border border-slate-800 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800">
                    <span @click="handleToggleShowItems">{{ t('nav_types') }}</span>
                    <ul v-if="showTypes" class="grid grid-cols-2 gap-4 mt-6">
                        <li v-for="(item, index) in types" :key="index">
                            <TypeTag :type="item.name" @click="close"/>
                        </li>
                    </ul>
                </div>

                <NuxtLink
                    to="/team"
                    class="rounded-lg border border-slate-800 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
                    active-class="border-slate-700 bg-slate-800 text-white"
                    @click="close"
                >
                    {{ t('nav_team', teamStore.teamCount) }}
                </NuxtLink>

                <NuxtLink
                    to="/battle"
                    class="rounded-lg border border-slate-800 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
                    active-class="border-slate-700 bg-slate-800 text-white"
                    @click="close"
                >
                    {{ t('nav_battle') }}
                </NuxtLink>

                <NuxtLink
                    to="/duel"
                    class="rounded-lg border border-slate-800 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
                    active-class="border-slate-700 bg-slate-800 text-white"
                    @click="close"
                >
                    {{ t('nav_duel') }}
                </NuxtLink>
            </nav>
        </aside>
    </div>
</template>
