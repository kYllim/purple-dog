<template>
  <div class="bg-background min-h-screen">
    <!-- Header simple pour le dashboard particulier -->
    <HeaderPublic />

    <main class="w-full px-12 py-12 mt-20">
      
      <!-- Filtres -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Recherche par nom -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-text/70 uppercase tracking-wide">Nom de l'objet</label>
            <div class="relative">
               <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
               <input 
                 v-model="filters.search"
                 type="text" 
                 placeholder="Montre suisse..." 
                 class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent transition-colors"
               />
            </div>
          </div>

          <!-- Catégorie -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-text/70 uppercase tracking-wide">Catégorie</label>
            <select 
              v-model="filters.category"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent transition-colors appearance-none"
            >
              <option value="">Toutes les catégories</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
            </select>
          </div>

           <!-- Type de vente -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-text/70 uppercase tracking-wide">Type de vente</label>
             <select 
              v-model="filters.saleType"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent transition-colors appearance-none"
            >
              <option value="">Tous les types</option>
              <option value="ENCHERE">Enchères</option>
              <option value="ACHAT_IMMEDIAT">Vente directe</option>
            </select>
          </div>

           <!-- Prix -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-text/70 uppercase tracking-wide">Prix</label>
            <div class="flex items-center gap-2">
               <input 
                 v-model.number="filters.minPrice"
                 type="number" 
                 placeholder="Min" 
                 class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent transition-colors"
               />
               <span class="text-gray-400">-</span>
               <input 
                 v-model.number="filters.maxPrice"
                 type="number" 
                 placeholder="Max" 
                 class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent transition-colors"
               />
            </div>
          </div>

        </div>
      </div>

      <!-- Grille d'objets -->
      <div v-if="loading" class="text-center py-20">
         <i class="fa-solid fa-circle-notch fa-spin text-4xl text-accent"></i>
         <p class="mt-4 text-gray-500">Chargement de vos objets...</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        
        <!-- Card d'ajout (toujours en premier) -->
        <div class="h-full">
            <AddObjectCard />
        </div>

        <!-- Liste des objets filtrés -->
        <div v-for="obj in filteredObjects" :key="obj.id" class="h-full">
            <ObjectCard :item="obj" @edit="handleEdit" @manage="handleEdit" />
        </div>

      </div>
      
      <!-- Message si aucun résultat -->
      <div v-if="!loading && filteredObjects.length === 0 && objects.length > 0" class="col-span-full text-center py-12 bg-white rounded-xl shadow-sm mt-8">
          <p class="text-lg text-gray-500">Aucun objet ne correspond à votre recherche.</p>
          <button @click="resetFilters" class="mt-4 text-accent font-bold hover:underline">Réinitialiser les filtres</button>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { objectService } from '../../services/objectService';
import { useAuthStore } from '../../stores/authStore';
import ObjectCard from '../../components/cards/ObjectCard.vue';
import AddObjectCard from '../../components/cards/AddObjectCard.vue';
import HeaderPublic from '../../components/HeaderPublic.vue';

const authStore = useAuthStore();
const objects = ref([]);
const categories = ref([]);
const loading = ref(true);

const filters = reactive({
    search: '',
    category: '',
    saleType: '',
    minPrice: '',
    maxPrice: ''
});

onMounted(async () => {
    loading.value = true;
    try {
        // En attendant que l'auth soit 100% fonctionnelle, on peut mocker l'ID ou utiliser celui du store
        // Récupération de l'ID utilisateur : check 'userId' (register) ou 'id' (login potentiel) ou fallback
        const userId = authStore.user?.userId || authStore.user?.id || 1; 
        console.log("Fetching objects for userID:", userId);

        const [objs, cats] = await Promise.all([
            objectService.getUserObjects(userId),
            objectService.getCategories()
        ]);
        
        objects.value = objs;
        categories.value = cats;

    } catch (error) {
        console.error("Erreur lors du chargement des objets", error);
    } finally {
        loading.value = false;
    }
});

const filteredObjects = computed(() => {
    return objects.value.filter(obj => {
        // Filtre Nom
        if (filters.search && !obj.titre.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }

        // Filtre Catégorie
        if (filters.category && obj.categorie_id != filters.category) {
            return false;
        }

        // Filtre Type de vente
        if (filters.saleType && obj.type_vente !== filters.saleType) {
            return false;
        }
        
        // Calcul du prix à comparer
        const price = obj.type_vente === 'ENCHERE' ? obj.prix_depart : (obj.prix_achat_immediat || obj.prix_souhaite);

        // Filtre Prix Min
        if (filters.minPrice && price < filters.minPrice) {
            return false;
        }

        // Filtre Prix Max
        if (filters.maxPrice && price > filters.maxPrice) {
            return false;
        }

        return true;
    });
});

const resetFilters = () => {
    filters.search = '';
    filters.category = '';
    filters.saleType = '';
    filters.minPrice = '';
    filters.maxPrice = '';
}
// Utilisation de useRouter est plus propre
const router = useRouter();
const handleEdit = (item) => {
    router.push({ name: 'EditObject', params: { id: item.id } });
}
</script>
