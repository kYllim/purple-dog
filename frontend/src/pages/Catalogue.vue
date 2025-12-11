<template>
  <PublicLayout>
    <div class="bg-background min-h-screen pt-20 pb-12">
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
                  <router-link 
                    v-for="objet in listeObjets" 
                    :key="objet.id" 
                    :to="`/catalogue/${objet.id}`"
                    class="group bg-white border border-gray-100 hover:border-accent hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                      <div class="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                          <img 
                            :src="objet.photos_urls?.[0] || '/placeholder.jpg'" 
                            :alt="objet.titre" 
                            class="w-full h-full object-cover"
                          />
                          <div class="absolute top-2 right-2">
                             <span v-if="objet.type_vente === 'ENCHERE'" class="bg-accent text-white text-[10px] uppercase font-bold px-2 py-1 tracking-wider">
                                 Enchère
                             </span>
                             <span v-else class="bg-text text-white text-[10px] uppercase font-bold px-2 py-1 tracking-wider">
                                 Achat Direct
                             </span>
                          </div>
                      </div>

                      <div class="p-4 flex flex-col flex-grow">
                          <h3 class="font-serif text-lg text-text mb-1 truncate group-hover:text-accent transition">{{ objet.titre }}</h3>
                          <p class="text-xs text-text/50 uppercase tracking-widest mb-3">{{ objet.categorie_nom }}</p>
                          
                          <div class="mt-auto flex justify-between items-end border-t border-gray-100 pt-3">
                              <div>
                                  <p class="text-[10px] text-text/50 uppercase">Prix</p>
                                  <p class="text-lg font-bold text-text">
                                      {{ formaterPrix(objet.type_vente === 'ENCHERE' ? objet.enchere_prix || objet.prix_depart : objet.prix_achat_immediat) }}
                                  </p>
                              </div>
                              <span class="text-accent text-xs font-bold uppercase group-hover:underline">Voir +</span>
                          </div>
                      </div>
                  </router-link>
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

onMounted(() => {
    chargerCategories();
    chargerObjets();
});
</script>
