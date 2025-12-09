<template>
  <header class="bg-white shadow-sm border-b sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <span class="font-bold text-lg text-text">PurpleDog</span>
      </div>

      <!-- Desktop links -->
      <nav class="hidden md:flex items-center gap-6 text-gray-700">
        <RouterLink to="/" class="nav-item">Accueil</RouterLink>
        <RouterLink to="/catalogue" class="nav-item">Catalogue</RouterLink>
        <RouterLink to="/dashboard/particulier" class="nav-item">Dashboard</RouterLink>
        <RouterLink to="/aide" class="nav-item">Aide</RouterLink>
      </nav>

      <!-- Right actions -->
      <div class="flex items-center gap-4">
        <button class="hidden md:inline-flex bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
          Déposer un objet
        </button>

        <!-- avatar + dropdown placeholder -->
        <div class="relative" @click="menuOpen = !menuOpen">
          <img src="https://i.pravatar.cc/40" class="w-10 h-10 rounded-full cursor-pointer border" />
          <div v-if="menuOpen" class="absolute right-0 mt-2 w-48 bg-white shadow rounded">
            <RouterLink to="/dashboard/particulier/profil" class="block px-4 py-2 hover:bg-gray-100">Profil</RouterLink>
            <RouterLink to="/dashboard/particulier" class="block px-4 py-2 hover:bg-gray-100">Tableau de bord</RouterLink>
            <button class="w-full text-left px-4 py-2 hover:bg-gray-100">Se déconnecter</button>
          </div>
        </div>
      </div>

      <!-- Mobile menu button -->
      <button class="md:hidden ml-3" @click="mobileOpen = !mobileOpen" aria-label="menu">
        <svg class="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden bg-white border-t shadow-sm px-6 py-4 flex flex-col gap-3">
      <RouterLink to="/" class="nav-item">Accueil</RouterLink>
      <RouterLink to="/catalogue" class="nav-item">Catalogue</RouterLink>
      <RouterLink to="/dashboard/particulier" class="nav-item">Dashboard</RouterLink>
      <RouterLink to="/aide" class="nav-item">Aide</RouterLink>
      <button class="bg-accent text-white px-4 py-2 rounded-lg">Déposer un objet</button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
const mobileOpen = ref(false);
const menuOpen = ref(false);
</script>

<style scoped>
.nav-item{
  @apply text-gray-600 hover:text-black hover:font-semibold transition;
}
</style>
