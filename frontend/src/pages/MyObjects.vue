<template>
  <PublicLayout>
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Mes objets</h1>
      
      <!-- Onglets -->
      <div class="flex gap-4 mb-6 border-b">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 font-semibold transition-colors',
            activeTab === tab.id
              ? 'text-accent border-b-2 border-accent'
              : 'text-gray-600 hover:text-text'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Contenu des onglets -->
      <div v-if="loading" class="text-center text-gray-500 py-12">
        Chargement...
      </div>

      <div v-else-if="filteredObjects.length === 0" class="text-center text-gray-500 py-12">
        Aucun objet dans cette catégorie.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FavoriteCard 
          v-for="item in filteredObjects" 
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import PublicLayout from '../layouts/PublicLayout.vue';
import FavoriteCard from '../components/cards/FavoriteCard.vue';
import { useFavoritesStore } from '../stores/favoritesStore';

const activeTab = ref('favoris');
const loading = ref(true);
const utilisateurId = ref(localStorage.getItem('userId'));
const favoritesStore = useFavoritesStore();

const tabs = [
  { id: 'favoris', label: 'Favoris' },
  { id: 'propositions', label: 'Propositions' },
  { id: 'encheres', label: 'Enchères' },
  { id: 'achats', label: 'Achats' },
  { id: 'pertes', label: 'Pertes' }
];

const objets = ref({
  favoris: [],
  propositions: [],
  encheres: [],
  achats: [],
  pertes: []
});

const filteredObjects = computed(() => {
  const tabName = activeTab.value;
  let items = objets.value[tabName] || [];
  
  if (tabName === 'favoris') {
    // Recalculer les favoris en fonction du store
    items = items.filter(item => favoritesStore.isFavorite(item.id));
    
    // Ajouter les nouveaux favoris depuis les autres onglets
    for (const tab of ['propositions', 'encheres', 'achats', 'pertes']) {
      for (const item of objets.value[tab]) {
        if (favoritesStore.isFavorite(item.id) && !items.find(f => f.id === item.id)) {
          items.push(item);
        }
      }
    }
  }
  
  return items;
});

onMounted(async () => {
  if (!utilisateurId.value) {
    loading.value = false;
    return;
  }

  try {
    await favoritesStore.loadFavorites(utilisateurId.value);

    const favResponse = await fetch(`http://localhost:3000/api/favorites/${utilisateurId.value}`);
    if (favResponse.ok) {
      objets.value.favoris = await favResponse.json();
    }

    const propResponse = await fetch(`http://localhost:3000/api/offres/${utilisateurId.value}`);
    if (propResponse.ok) {
      objets.value.propositions = await propResponse.json();
    }

    const enchResponse = await fetch(`http://localhost:3000/api/encheres/${utilisateurId.value}`);
    if (enchResponse.ok) {
      objets.value.encheres = await enchResponse.json();
    }

    const achatsResponse = await fetch(`http://localhost:3000/api/achats/${utilisateurId.value}`);
    if (achatsResponse.ok) {
      objets.value.achats = await achatsResponse.json();
    }

    const pertesResponse = await fetch(`http://localhost:3000/api/encheres-perdues/${utilisateurId.value}`);
    if (pertesResponse.ok) {
      objets.value.pertes = await pertesResponse.json();
    }
  } catch (err) {
    console.error('Erreur lors du chargement:', err);
  } finally {
    loading.value = false;
  }
});
</script>