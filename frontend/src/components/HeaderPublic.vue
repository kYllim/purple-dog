<template>
  <header class="fixed w-full top-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm">
    <div class="max-w-[1920px] mx-auto px-6 h-20 flex justify-between items-center">
      <!-- Logo -->
      <router-link to="/" class="text-2xl font-black tracking-tighter text-text uppercase">
        Purple<span class="text-accent">Dog</span>
      </router-link>
      
      <!-- Desktop Nav -->
      <nav class="hidden md:flex space-x-12 items-center">

        <template v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
            Se connecter
          </router-link>
          <router-link to="/register" class="border border-text text-text px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-text hover:text-white transition-all duration-300">
            S’inscrire
          </router-link>
        </template>
        
        <template v-else>
           <!-- Admin/Pro Dashboard Link -->
           <router-link to="/" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
             Accueil
           </router-link>
           <router-link to="/auctions" class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300">
             Enchères
           </router-link>
           
           <router-link 
             v-if="authStore.isAdmin || authStore.isPro" 
             to="/admin" 
             class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300"
           >
             Dashboard
           </router-link>

           <!-- User Profile Link -->
           <router-link 
             to="/profile/edit" 
             class="text-sm font-bold uppercase tracking-widest text-text hover:text-accent transition-colors duration-300"
           >
             Mon Compte
           </router-link>

           <button 
             @click="handleLogout" 
             class="border border-text text-text px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-text hover:text-white transition-all duration-300"
           >
             Déconnexion
           </button>
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
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

// Future enhancement: Add scroll listener to change opacity
const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/');
}
</script>
