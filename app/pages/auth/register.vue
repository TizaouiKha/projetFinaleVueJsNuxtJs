<script setup lang="ts">
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    await navigateTo('/auth/login')
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-16 space-y-6">
    <h1 class="text-xl font-bold">Inscription</h1>

    <form class="space-y-3" @submit.prevent="onSubmit">
      <input v-model="username" type="text" placeholder="Nom d'utilisateur" required class="border p-2 w-full" />
      <input v-model="password" type="password" placeholder="Mot de passe" required class="border p-2 w-full" />
      <input v-model="confirmPassword" type="password" placeholder="Confirmer le mot de passe" required class="border p-2 w-full" />
      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
      <button type="submit" :disabled="loading" class="bg-blue-600 text-white p-2 w-full rounded">
        {{ loading ? 'Création...' : 'Créer mon compte' }}
      </button>
    </form>

    <p class="text-center text-sm">
      Déjà un compte ?
      <NuxtLink to="/auth/login" class="text-blue-600 underline">Se connecter</NuxtLink>
    </p>
  </div>
</template>