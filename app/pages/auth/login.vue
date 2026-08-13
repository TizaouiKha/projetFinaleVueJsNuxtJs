<script setup lang="ts">
const { login, fetch: refreshSession } = useOidcAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    await refreshSession()
    await navigateTo('/')
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-16 space-y-6">
    <h1 class="text-xl font-bold">Connexion</h1>

    <form class="space-y-3" @submit.prevent="onSubmit">
      <input v-model="email" type="email" placeholder="Email" required class="border p-2 w-full" />
      <input v-model="password" type="password" placeholder="Mot de passe" required class="border p-2 w-full" />
      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
      <button type="submit" :disabled="loading" class="bg-blue-600 text-white p-2 w-full rounded">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>

    <p class="text-center text-sm">
  Pas encore de compte ?
  <NuxtLink to="/auth/register" class="text-blue-600 underline">S'inscrire</NuxtLink>
</p>

    <div class="text-center text-sm text-gray-500">ou</div>

    <button @click="login('github')" class="border p-2 w-full rounded flex items-center justify-center gap-2">
      Se connecter avec GitHub
    </button>
  </div>
</template>