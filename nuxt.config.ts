// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@pinia/nuxt'],
  
  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  // on déclare l'URL de l'API ici (propre + réutilisable)
  runtimeConfig: {
    public: {
      pokeApiBase: 'http://localhost:3000/api',
    },
  },

  eslint: {
    config: {
      stylistic: true
    }
  }
})

