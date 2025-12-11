<template>
  <PublicLayout>
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Mon historique</h1>
      
      <div v-if="loading" class="text-center text-gray-500 py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        Chargement...
      </div>
      
      <div v-else-if="allItems.length === 0" class="text-center text-gray-500 py-12">
        Aucun historique pour le moment.
      </div>
      
      <div v-else class="space-y-6">
        <HistoryCard 
          v-for="item in allItems" 
          :key="item.id"
          :item="item"
          :type="item.type"
        />
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import PublicLayout from '../layouts/PublicLayout.vue';
import HistoryCard from '../components/cards/HistoryCard.vue';
import { useFavoritesStore } from '../stores/favoritesStore';

const achats = ref([]);
const pertes = ref([]);
const propositions = ref([]);
const loading = ref(true);
const utilisateurId = ref(localStorage.getItem('userId'));
const favoritesStore = useFavoritesStore();

const allItems = computed(() => {
  return [
    ...achats.value.map(a => ({ ...a, type: 'achat' })),
    ...pertes.value.map(p => ({ ...p, type: 'perte' })),
    ...propositions.value.map(p => ({ ...p, type: 'proposition' }))
  ];
});

onMounted(async () => {
  if (!utilisateurId.value) {
    console.warn('Pas d\'utilisateur connecté');
    loading.value = false;
    return;
  }

  try {
    // Charger les favoris dans le store
    await favoritesStore.loadFavorites(utilisateurId.value);

    const [achatsRes, pertesRes, propsRes] = await Promise.all([
      fetch(`http://localhost:3000/api/achats/${utilisateurId.value}`),
      fetch(`http://localhost:3000/api/encheres-perdues/${utilisateurId.value}`),
      fetch(`http://localhost:3000/api/offres/${utilisateurId.value}`)
    ]);

    if (achatsRes.ok) {
      const data = await achatsRes.json();
      console.log('Achats:', data);
      achats.value = data;
    }
    if (pertesRes.ok) {
      const data = await pertesRes.json();
      console.log('Enchères perdues:', data);
      pertes.value = data;
    }
    if (propsRes.ok) {
      const data = await propsRes.json();
      console.log('Propositions:', data);
      propositions.value = data;
    }
  } catch (err) {
    console.error('Erreur:', err);
  } finally {
    loading.value = false;
  }
});
</script>