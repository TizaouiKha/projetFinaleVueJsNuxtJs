<template>
  <div class="min-h-screen bg-black text-white">
    <nav>
      <NuxtLink to="/" class="block bg-slate-950 p-4 text-center text-lg font-bold text-white hover:bg-slate-800">
        Accueil
      </NuxtLink>
      <NuxtLink to="/types" class="block bg-slate-950 p-4 text-center text-lg font-bold text-white hover:bg-slate-800">
        Types
      </NuxtLink>
    </nav>
    <NuxtPage />
  </div>
</template>