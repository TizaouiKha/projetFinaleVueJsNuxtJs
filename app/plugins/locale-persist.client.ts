import { watch } from 'vue'
import { LOCALE_STORAGE_KEY, useLocaleStore, type Locale } from '../stores/locale'

export default defineNuxtPlugin(() => {
    const localeStore = useLocaleStore()

    try {
        const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
        if (stored === 'fr' || stored === 'en') {
            localeStore.locale = stored as Locale
        }
    } catch (err) {
        console.error('Impossible de charger la langue sauvegardée', err)
    }

    watch(() => localeStore.locale, (value) => {
        localStorage.setItem(LOCALE_STORAGE_KEY, value)
    })
})
