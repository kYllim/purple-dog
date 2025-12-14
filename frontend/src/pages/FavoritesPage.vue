<template>
  <PublicLayout>
    <div class="max-w-7xl mx-auto px-6 py-12 mt-20 min-h-screen">
      <h1 class="text-4xl font-serif text-text mb-8 uppercase tracking-widest border-b border-accent/20 pb-4">
          Mes Favoris
      </h1>

      <div v-if="loading" class="flex justify-center py-20">
          <i class="fa-solid fa-circle-notch fa-spin text-4xl text-accent"></i>
      </div>

      <div v-else-if="favorites.length === 0" class="text-center py-20 bg-gray-50 rounded-lg">
          <i class="fa-regular fa-heart text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Vous n'avez aucun favori pour le moment.</p>
          <router-link to="/catalogue" class="inline-block mt-4 px-6 py-2 bg-accent text-white rounded hover:bg-black transition-colors">
              Explorer le catalogue
          </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PublicObjectCard 
            v-for="fav in favorites" 
            :key="fav.id" 
            :objet="fav"
            :is-favorite="true"
            @toggle-favorite="toggleFavorite(fav)"
          />
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { favoritesService } from '../services/favoritesService';
import PublicLayout from '../layouts/PublicLayout.vue';
import PublicObjectCard from '../components/cards/PublicObjectCard.vue';
import { useAuthStore } from '../stores/authStore';

const loading = ref(true);
const favorites = ref([]);
const authStore = useAuthStore();

const loadFavorites = async () => {
    try {
        if (!authStore.isAuthenticated) return;
        favorites.value = await favoritesService.getFavorites();
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const toggleFavorite = async (objet) => {
    // In Favorites page, toggling always means removing
    if (!confirm("Retirer des favoris ?")) return;
    try {
        await favoritesService.removeFavorite(objet.id);
        favorites.value = favorites.value.filter(f => f.id !== objet.id);
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    loadFavorites();
});
</script>
