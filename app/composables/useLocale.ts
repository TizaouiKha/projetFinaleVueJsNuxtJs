import { storeToRefs } from 'pinia'
import { useLocaleStore } from '../stores/locale'
import { translations, type TranslationKey } from '../i18n/translations'
import { translateType } from '../utils/pokemonTypeTranslations'
import type { Pokemon } from '../types/pokemon'

export function useLocale() {
    const localeStore = useLocaleStore()
    const { locale } = storeToRefs(localeStore)

    const t = (key: TranslationKey, ...args: any[]): string => {
        const entry = translations[locale.value][key] as unknown
        return typeof entry === 'function' ? (entry as (...a: any[]) => string)(...args) : (entry as string)
    }

    const pokemonName = (pokemon: Pick<Pokemon, 'name' | 'nameFr'>): string => {
        return locale.value === 'fr' ? (pokemon.nameFr ?? pokemon.name) : pokemon.name
    }

    const typeName = (type?: string | null): string => translateType(type, locale.value)

    return {
        locale,
        setLocale: localeStore.setLocale,
        toggleLocale: localeStore.toggleLocale,
        t,
        pokemonName,
        typeName,
    }
}
