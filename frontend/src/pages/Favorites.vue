<template>
  <PublicLayout>
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Mes favoris</h1>
      
      <div v-if="loading" class="text-center text-gray-500 py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        Chargement...
      </div>
      
      <div v-else-if="favoris.length === 0" class="text-center text-gray-500 py-12">
        Aucun favoris pour le moment.
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FavoriteCard 
          v-for="item in favoris" 
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PublicLayout from '../layouts/PublicLayout.vue';
import FavoriteCard from '../components/cards/FavoriteCard.vue';
import { useFavoritesStore } from '../stores/favoritesStore';

const favoris = ref([]);
const loading = ref(true);
const utilisateurId = ref(localStorage.getItem('userId'));
const favoritesStore = useFavoritesStore();

onMounted(async () => {
  if (!utilisateurId.value) {
    loading.value = false;
    return;
  }

  try {
    // Charger les favoris dans le store
    await favoritesStore.loadFavorites(utilisateurId.value);

    const response = await fetch(`http://localhost:3000/api/favorites/${utilisateurId.value}`);
    if (response.ok) {
      favoris.value = await response.json();
    }
  } catch (err) {
    console.error('Erreur:', err);
  } finally {
    loading.value = false;
  }
});
</script>