<template>
  <header class="fixed w-full top-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm">
    <div class="max-w-[1920px] mx-auto px-6 h-20 flex justify-between items-center">
      <!-- Logo -->
      <router-link to="/" class="text-2xl font-black tracking-tighter text-text uppercase">
        Purple<span class="text-accent">Dog</span>
      </router-link>
      
      <!-- Desktop Nav -->
      <nav class="hidden md:flex space-x-12 items-center">

        <!-- Unauthenticated -->
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
            Se connecter
          </router-link>
          <router-link to="/register" class="border border-text text-text px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-text hover:text-white transition-all duration-300">
            S’inscrire
          </router-link>
        </template>

        <!-- Authenticated -->  
        <template v-else>
          
          <!-- Particulier -->
          <template v-if="authStore.isParticulier">
            <router-link 
              to="/particulier/mes-objets" 
              class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300"
            >
              Mes objets
            </router-link>
          </template>

          <!-- Pro -->
          <template v-if="authStore.isPro">
            <router-link to="/pro/mes-objets" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
              Mes objets
            </router-link>
            <router-link to="/catalogue" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
              Catalogue
            </router-link>
            <router-link to="/mes-encheres" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
               Mes Enchères
            </router-link>
            <router-link to="/mes-favoris" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
             Mes favoris
            </router-link>
          </template>

          <!-- Admin (Optional) -->
          <router-link 
            v-if="authStore.isAdmin" 
            to="/admin" 
            class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300"
          >
            Dashboard
          </router-link>

          <!-- User Profile & Logout -->
          <div class="flex items-center gap-4">
            <!-- Menu profil avec dropdown -->
            <div class="relative">
              <button
                @click="isProfileOpen = !isProfileOpen"
                class="flex items-center gap-2 text-sm font-medium text-text hover:text-accent transition-colors duration-300"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                <span class="max-w-[150px] truncate">{{ authStore.user?.email || 'Mon Compte' }}</span>
              </button>

              <div
                v-if="isProfileOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <router-link
                  :to="authStore.isPro ? '/pro/profil' : '/particulier/profil'"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  @click="isProfileOpen = false"
                >
                  Mon Profil
                </router-link>
                <router-link
                  v-if="authStore.isPro"
                  to="/mes-commandes"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  @click="isProfileOpen = false"
                >
                  Mes Commandes
                </router-link>
                <router-link
                  v-if="authStore.isParticulier"
                  to="/particulier/mes-ventes"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  @click="isProfileOpen = false"
                >
                  Mes Ventes
                </router-link>
                <router-link
                  :to="authStore.isPro ? '/pro/messages' : '/particulier/messages'"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  @click="isProfileOpen = false"
                >
                  Mes messages
                </router-link>
              </div>
            </div>

            <!-- Icône déconnexion -->
            <button 
              @click="handleLogout" 
              class="p-2 text-text hover:text-accent transition-colors duration-300"
              title="Se déconnecter"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </template>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isProfileOpen = ref(false);

const handleLogout = () => {
  isProfileOpen.value = false;
  authStore.logout();
  router.push('/');
}

// Fermer le menu au clic en dehors
const handleClickOutside = (e) => {
  const menu = document.querySelector('.relative');
  if (menu && !menu.contains(e.target)) {
    isProfileOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
