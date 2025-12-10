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
          <router-link 
            v-if="authStore.isParticulier" 
            to="/particulier/dashboard" 
            class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300"
          >
            Mes objets
          </router-link>
          <router-link 
            v-if="authStore.isParticulier" 
            to="/particulier/vendre" 
            class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300"
          >
            Mettre en vente
          </router-link>

          <!-- Pro -->
          <template v-if="authStore.isPro">
            <router-link to="/favorites" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
              Mes favoris
            </router-link>
            <router-link to="/auctions" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
               Enchères
            </router-link>
            <router-link to="/history" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
               Historique
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
          <div class="flex items-center space-x-4 border-l pl-6 border-gray-200">
            <router-link to="/profile/edit" class="flex items-center space-x-2 group">
               <div class="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  <UserIcon class="w-5 h-5" />
               </div>
               <span class="text-sm font-bold text-text group-hover:text-accent transition-colors duration-300 max-w-[150px] truncate">
                 {{ authStore.user?.email || 'Mon Compte' }}
               </span>
            </router-link>

            <button 
              @click="handleLogout" 
              class="text-text hover:text-red-500 transition-colors duration-300"
              title="Se déconnecter"
            >
              <ArrowRightOnRectangleIcon class="w-6 h-6" />
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
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline';

// Future enhancement: Add scroll listener to change opacity

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/');
}
</script>
