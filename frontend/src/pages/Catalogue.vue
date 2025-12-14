<template>
  <PublicLayout>
    <div class="bg-background min-h-screen pt-20 pb-12 mt-6">
      <div class="max-w-[1920px] mx-auto px-6">
        
        <header class="mb-12 text-center py-10 bg-white border-b border-gray-100 shadow-sm">
          <h1 class="text-4xl md:text-5xl font-serif text-text uppercase tracking-widest mb-4">
            Catalogue
          </h1>
          <p class="text-text/60 text-sm uppercase tracking-wide max-w-2xl mx-auto">
            Explorez notre sélection d'objets d'exception, authentifiés par nos experts.
          </p>
        </header>

        <div class="flex flex-col lg:flex-row gap-8">
          
          <aside class="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div class="bg-white p-6 shadow-sm border border-gray-100 rounded-sm">
              <h3 class="font-bold text-lg uppercase tracking-wide mb-4 border-b border-accent pb-2">Filtres</h3>
              
              <div class="mb-6">
                <h4 class="font-bold text-sm uppercase tracking-wider mb-3 text-text/80">Catégorie</h4>
                <div class="space-y-2">
                    <label class="flex items-center space-x-2 cursor-pointer group">
                        <input type="radio" value="" v-model="filtres.categorie_id" class="text-accent focus:ring-accent" />
                        <span class="text-sm text-text/70 group-hover:text-accent transition">Toutes</span>
                    </label>
                    <label v-for="cat in categories" :key="cat.id" class="flex items-center space-x-2 cursor-pointer group">
                        <input type="radio" :value="cat.id" v-model="filtres.categorie_id" class="text-accent focus:ring-accent" />
                        <span class="text-sm text-text/70 group-hover:text-accent transition">{{ cat.nom }}</span>
                    </label>
                </div>
              </div>

              <div class="mb-6">
                 <h4 class="font-bold text-sm uppercase tracking-wider mb-3 text-text/80">Type Vente</h4>
                  <div class="space-y-2">
                    <label class="flex items-center space-x-2 cursor-pointer group">
                        <input type="radio" value="" v-model="filtres.type_vente" class="text-accent focus:ring-accent" />
                        <span class="text-sm text-text/70 group-hover:text-accent transition">Tout</span>
                    </label>
                     <label class="flex items-center space-x-2 cursor-pointer group">
                        <input type="radio" value="ENCHERE" v-model="filtres.type_vente" class="text-accent focus:ring-accent" />
                        <span class="text-sm text-text/70 group-hover:text-accent transition">Enchères</span>
                    </label>
                     <label class="flex items-center space-x-2 cursor-pointer group">
                        <input type="radio" value="INSTANTANE" v-model="filtres.type_vente" class="text-accent focus:ring-accent" />
                        <span class="text-sm text-text/70 group-hover:text-accent transition">Achat Immédiat</span>
                    </label>
                  </div>
              </div>

              <button 
                @click="appliquerFiltres" 
                class="w-full bg-text text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-accent transition-colors duration-300"
              >
                Filtrer
              </button>
            </div>
          </aside>

          <div class="flex-grow">
              
              <div v-if="estChargement" class="flex justify-center items-center h-64">
                   <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
              </div>

              <div v-else-if="listeObjets.length === 0" class="text-center py-20 bg-white shadow-sm border border-gray-100">
                  <p class="text-lg text-text/60 font-serif italic mb-4">Aucun objet trouvé.</p>
                  <button @click="reinitialiserFiltres" class="text-accent text-sm font-bold uppercase underline hover:text-text transition">
                      Réinitialiser les filtres
                  </button>
              </div>

              <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <PublicObjectCard 
                    v-for="objet in listeObjets" 
                    :key="objet.id" 
                    :objet="objet"
                    :is-favorite="favoriteIds.has(objet.id)"
                    @toggle-favorite="toggleFavorite"
                  />
              </div>
            
             <div class="mt-12 flex justify-center gap-4" v-if="meta.pages > 1">
                  <button 
                    @click="changerPage(meta.page - 1)" 
                    :disabled="meta.page === 1"
                    class="px-4 py-2 border border-text text-text disabled:opacity-30 disabled:cursor-not-allowed hover:bg-text hover:text-white transition uppercase text-xs font-bold"
                  >
                      Précédent
                  </button>
                   <span class="px-4 py-2 text-sm font-bold">{{ meta.page }} / {{ meta.pages }}</span>
                  <button 
                    @click="changerPage(meta.page + 1)" 
                    :disabled="meta.page === meta.pages"
                    class="px-4 py-2 border border-text text-text disabled:opacity-30 disabled:cursor-not-allowed hover:bg-text hover:text-white transition uppercase text-xs font-bold"
                  >
                      Suivant
                  </button>
             </div>

          </div>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import PublicLayout from '../layouts/PublicLayout.vue';
import serviceObjets from '../services/objetsService';
import { favoritesService } from '../services/favoritesService';
import { useAuthStore } from '../stores/authStore';
import PublicObjectCard from '../components/cards/PublicObjectCard.vue';

const listeObjets = ref([]);
const categories = ref([]);
const estChargement = ref(true);
const meta = ref({ page: 1, limit: 12, pages: 1 });

const filtres = reactive({
    categorie_id: '',
    type_vente: '',
    prix_min: '',
    prix_max: ''
});

const chargerCategories = async () => {
    try {
        const reponse = await serviceObjets.recupererCategories();
        categories.value = reponse.data;
    } catch (e) {
        console.error("Erreur catégories", e);
    }
};

const chargerObjets = async () => {
    estChargement.value = true;
    try {
        const parametres = {
            page: meta.value.page,
            limit: meta.value.limit,
            ...filtres
        };
        
        Object.keys(parametres).forEach(cle => (parametres[cle] === '' || parametres[cle] == null) && delete parametres[cle]);

        const reponse = await serviceObjets.recupererTout(parametres);
        listeObjets.value = reponse.data.data;
        meta.value = reponse.data.meta;
    } catch (e) {
        console.error("Erreur chargement objets", e);
    } finally {
        estChargement.value = false;
    }
};

const appliquerFiltres = () => {
    meta.value.page = 1;
    chargerObjets();
};

const reinitialiserFiltres = () => {
    filtres.categorie_id = '';
    filtres.type_vente = '';
    appliquerFiltres();
};

const changerPage = (nouvellePage) => {
    if (nouvellePage >= 1 && nouvellePage <= meta.value.pages) {
        meta.value.page = nouvellePage;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        chargerObjets();
    }
};

const formaterPrix = (prix) => {
    if (!prix) return 'N/A';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(prix);
};

const authStore = useAuthStore();
const favoriteIds = ref(new Set());

const chargerFavoris = async () => {
    if (!authStore.isAuthenticated) return;
    try {
        const favs = await favoritesService.getFavorites();
        favoriteIds.value = new Set(favs.map(f => f.id));
    } catch (e) {
        console.error("Erreur favoris", e);
    }
};

const toggleFavorite = async (objet) => {
    // e.preventDefault(); // Removed, handled in component
    if (!authStore.isAuthenticated) {
        alert("Connectez-vous pour ajouter aux favoris");
        return;
    }

    try {
        if (favoriteIds.value.has(objet.id)) {
            await favoritesService.removeFavorite(objet.id);
            favoriteIds.value.delete(objet.id);
        } else {
            await favoritesService.addFavorite(objet.id);
            favoriteIds.value.add(objet.id);
        }
    } catch (error) {
        console.error("Erreur toggle favori", error);
    }
};

onMounted(() => {
    chargerCategories();
    chargerObjets();
    chargerFavoris();
});
</script>
