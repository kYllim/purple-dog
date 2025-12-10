<template>
  <header class="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
    <div class="max-w-[1920px] mx-auto px-6 h-20 flex justify-between items-center">
      
      <!-- Logo -->
      <router-link to="/" class="text-2xl font-black tracking-tighter text-text uppercase">
        Purple<span class="text-accent">Dog</span>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex space-x-12 items-center relative">
        <router-link to="/" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
          Dashboard
        </router-link>
        <router-link to="/auctions" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
          Mes ventes
        </router-link>
        <router-link to="/avis" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
          Avis
        </router-link>

        <!-- Profil -->
        <div class="relative">
          <button
            @click="isProfileOpen = !isProfileOpen"
            class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300"
          >
            Profil
          </button>

          <div
            v-if="isProfileOpen"
            class="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <router-link
              to="/dashboard/particulier/profil"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              @click="isProfileOpen = false"
            >
              Mon profil
            </router-link>
            <router-link
              to="/dashboard/particulier/messages"
              class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              @click="isProfileOpen = false"
            >
              Mes messages
            </router-link>
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile menu button -->
      <button class="md:hidden text-text hover:text-accent transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const isProfileOpen = ref(false);

function logout() {
  console.log("Déconnexion");
  isProfileOpen.value = false;
  window.location.href = "/login";
}

document.addEventListener('click', (e) => {
  const menu = document.querySelector('.relative');
  if (menu && !menu.contains(e.target)) {
    isProfileOpen.value = false;
  }
});
</script>
