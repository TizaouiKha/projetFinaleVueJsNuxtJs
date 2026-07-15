import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  vite: {
    plugins: [
      tailwindcss()
    ]
  }
})