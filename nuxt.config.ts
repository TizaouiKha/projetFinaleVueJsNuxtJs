import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', 'nuxt-oidc-auth'],
  oidc: {
    defaultProvider: 'github',
    providers: {
      github: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: 'http://localhost:3000/auth/github/callback',
        postLogoutRedirectUri: 'http://localhost:3000/',
        responseType: 'code',
        scope: ['openid', 'profile', 'email']
      }
    },
    middleware: {
      globalMiddlewareEnabled: true,
      customLoginPage: true
        }
  },

  css: [
    '~/assets/css/main.css'
  ],

  vite: {
    plugins: [
      tailwindcss()
    ]
  }
})