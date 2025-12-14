<template>
  <div class="bg-background min-h-screen">
    <HeaderPublic />

    <main class="w-full px-12 py-12 mt-20">
      
      <header class="mb-10 flex items-center justify-between">
          <h1 class="text-3xl font-serif text-text uppercase tracking-widest">Mes Ventes</h1>
          <p class="text-text/60 font-medium">{{ sales.length }} objet(s) vendus</p>
      </header>

      <div v-if="loading" class="text-center py-20">
         <i class="fa-solid fa-circle-notch fa-spin text-4xl text-accent"></i>
         <p class="mt-4 text-gray-500">Chargement de vos ventes...</p>
      </div>

      <div v-else-if="sales.length === 0" class="text-center py-20 bg-white shadow-sm border border-gray-100 rounded-sm">
          <i class="fa-solid fa-box-open text-4xl text-gray-300 mb-4"></i>
          <p class="text-lg text-text/60 font-serif italic mb-4">Vous n'avez pas encore effectué de vente.</p>
          <router-link to="/particulier/mes-objets" class="text-accent underline font-bold uppercase text-xs tracking-widest">
              Gérer mes objets
          </router-link>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="obj in sales" :key="obj.id" class="h-full">
            <ObjectCard :item="obj" :readonly="true" />
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { objectService } from '../../services/objectService';
import { useAuthStore } from '../../stores/authStore';
import ObjectCard from '../../components/cards/ObjectCard.vue';
import HeaderPublic from '../../components/HeaderPublic.vue';

const authStore = useAuthStore();
const sales = ref([]);
const loading = ref(true);

onMounted(async () => {
    loading.value = true;
    try {
        const userId = authStore.user?.id; 
        if (!userId) return;

        const allObjects = await objectService.getUserObjects(userId);
        // Filter mainly by status VENDU. We could filter by others if relevant.
        sales.value = allObjects.filter(obj => obj.statut === 'VENDU');

    } catch (error) {
        console.error("Erreur chargement ventes", error);
    } finally {
        loading.value = false;
    }
});
</script>
