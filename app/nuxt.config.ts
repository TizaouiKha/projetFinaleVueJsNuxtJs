// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
