<template>
  <PublicLayout>
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Tous les objets</h1>
      
      <div v-if="loading" class="text-center text-gray-500 py-12">
        Chargement des objets...
      </div>
      
      <div v-else-if="objets.length === 0" class="text-center text-gray-500 py-12">
        Aucun objet disponible pour le moment.
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FavoriteCard 
          v-for="item in objets" 
          :key="item.id"
          :item="item"
          @toggle-favorite="handleToggleFavorite"
        />
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PublicLayout from '../layouts/PublicLayout.vue';
import FavoriteCard from '../components/cards/FavoriteCard.vue';

const objets = ref([]);
const loading = ref(true);
const utilisateurId = ref(localStorage.getItem('userId') || null);

onMounted(async () => {
  try {
    const queryParam = utilisateurId.value ? `?utilisateur_id=${utilisateurId.value}` : '';
    const response = await fetch(`http://localhost:3000/api/objets${queryParam}`);
    if (response.ok) {
      objets.value = await response.json();
    } else {
      console.error('Erreur API:', response.status);
    }
  } catch (err) {
    console.error('Erreur lors du chargement:', err);
  } finally {
    loading.value = false;
  }
});

const handleToggleFavorite = (data) => {
  console.log('Favori togglé:', data);
};
</script>