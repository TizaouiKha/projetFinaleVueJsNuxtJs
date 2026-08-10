import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Locale = 'fr' | 'en'
export const LOCALE_STORAGE_KEY = 'pokemon-locale'

export const useLocaleStore = defineStore('locale', () => {
    const locale = ref<Locale>('fr')

    const setLocale = (value: Locale) => {
        locale.value = value
    }

    const toggleLocale = () => {
        locale.value = locale.value === 'fr' ? 'en' : 'fr'
    }

    return {
        locale,
        setLocale,
        toggleLocale,
    }
})
