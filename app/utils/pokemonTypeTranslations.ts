import type { Locale } from '../stores/locale'

export const pokemonTypeTranslations: Record<string, Record<Locale, string>> = {
  normal: { fr: "Normal", en: "Normal" },
  fighting: { fr: "Combat", en: "Fighting" },
  flying: { fr: "Vol", en: "Flying" },
  poison: { fr: "Poison", en: "Poison" },
  ground: { fr: "Sol", en: "Ground" },
  rock: { fr: "Roche", en: "Rock" },
  bug: { fr: "Insecte", en: "Bug" },
  ghost: { fr: "Spectre", en: "Ghost" },
  steel: { fr: "Acier", en: "Steel" },
  fire: { fr: "Feu", en: "Fire" },
  water: { fr: "Eau", en: "Water" },
  grass: { fr: "Plante", en: "Grass" },
  electric: { fr: "Électrik", en: "Electric" },
  psychic: { fr: "Psy", en: "Psychic" },
  ice: { fr: "Glace", en: "Ice" },
  dragon: { fr: "Dragon", en: "Dragon" },
  dark: { fr: "Ténèbres", en: "Dark" },
  fairy: { fr: "Fée", en: "Fairy" },
  stellar: { fr: "Stellaire", en: "Stellar" },
  unknown: { fr: "Inconnu", en: "Unknown" },
}

export const translateType = (type?: string | null, locale: Locale = 'fr'): string => {
  if (!type) return ''
  const entry = pokemonTypeTranslations[type.toLowerCase()]
  if (!entry) return type
  return entry[locale]
}
