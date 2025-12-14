<template>
    <div class="pb-12">
      <div class="max-w-7xl mx-auto">
        
        <header class="mb-8 flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-serif text-text uppercase tracking-widest mb-2">Administration Objets</h1>
                <p class="text-text/60 text-sm">Modération des annonces</p>
            </div>

        </header>

        <div class="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden">
            <div v-if="loading" class="p-12 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
            </div>

            <div v-else-if="objets.length === 0" class="p-12 text-center text-text/60 italic">
                Aucun objet à afficher.
            </div>

            <table v-else class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-text/60">
                        <th class="p-4">Image</th>
                        <th class="p-4">Titre</th>
                        <th class="p-4">Vendeur</th>
                        <th class="p-4">Prix</th>
                        <th class="p-4">Statut</th>
                        <th class="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="objet in objets" :key="objet.id" :class="['hover:bg-gray-50 transition', objet.est_bloque ? 'opacity-50 grayscale' : '']">
                        <td class="p-4">
                            <img :src="objet.photos_urls?.[0] || '/placeholder.jpg'" class="w-16 h-12 object-cover rounded-sm border border-gray-200" />
                        </td>
                        <td class="p-4">
                            <router-link :to="`/objets/${objet.id}`" target="_blank" class="font-bold text-text hover:text-accent truncate block max-w-[200px]">
                                {{ objet.titre }}
                            </router-link>
                            <span class="text-xs text-text/50 uppercase">{{ objet.categorie_nom }}</span>
                        </td>
                        <td class="p-4 text-sm text-text/80">
                            {{ objet.vendeur_email }}
                        </td>
                        <td class="p-4 font-bold text-sm">
                            {{ formatPrice(objet.prix_souhaite || objet.prix_depart || objet.prix_achat_immediat) }}
                        </td>
                        <td class="p-4">
                            <span :class="getStatusClass(objet.statut)" class="px-2 py-1 text-[10px] uppercase font-bold tracking-wide rounded-sm border">
                                {{ objet.statut }}
                            </span>
                        </td>
                        <td class="p-4 text-right">
                            <button 
                                @click="confirmerSuppression(objet)"
                                class="text-red-500 hover:text-red-700 font-bold text-xs uppercase hover:underline"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

      </div>
    
    

     <div v-if="modalOuverte" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
       <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
         
         <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h3 class="text-xl font-serif font-bold text-[#0F172A]">Confirmer la suppression</h3>
           <button @click="fermerModal" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
         </div>
 
         <div class="p-6 text-center">
              <div class="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
              </div>
              <p class="text-slate-600 mb-1">
                 Vous êtes sur le point de supprimer l'objet
              </p>
              <p class="font-bold text-[#0F172A] text-lg mb-2">{{ objetSelectionne?.titre }}</p>
              <p class="text-xs text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 rounded px-2 py-1 inline-block">
                 ⚠️ Cette action est irréversible et supprimera toutes les données associées.
              </p>
         </div>
 
         <div class="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
             <button @click="fermerModal" class="px-5 py-2 rounded-lg text-slate-500 hover:bg-white hover:shadow-sm font-medium text-sm transition-all">
                 Annuler
             </button>
             <button @click="executerSuppression" :disabled="enSuppression" class="bg-[#C5A059] hover:bg-[#b08d4d] text-white px-6 py-2 rounded-lg shadow-lg shadow-[#C5A059]/20 font-bold transition-all flex items-center gap-2">
                 <span v-if="enSuppression" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                 Supprimer Définitivement
             </button>
         </div>
 
       </div>
     </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import serviceAdmin from '../../services/adminService';

const objets = ref([]);
const loading = ref(true);

// État Modal
const modalOuverte = ref(false);
const enSuppression = ref(false);
const objetSelectionne = ref(null);

const chargerObjets = async () => {
    loading.value = true;
    try {
        const res = await serviceAdmin.recupererObjets();
        objets.value = res.data;
    } catch (e) {
        console.error("Erreur chargement admin objets", e);
        alert("Erreur lors du chargement des objets.");
    } finally {
        loading.value = false;
    }
};

const confirmerSuppression = (objet) => {
    objetSelectionne.value = objet;
    modalOuverte.value = true;
};

const fermerModal = () => {
    modalOuverte.value = false;
    objetSelectionne.value = null;
};

const executerSuppression = async () => {
    if (!objetSelectionne.value) return;
    
    enSuppression.value = true;
    try {
        await serviceAdmin.supprimerObjet(objetSelectionne.value.id);
        objets.value = objets.value.filter(o => o.id !== objetSelectionne.value.id);
        fermerModal();
    } catch (e) {
        console.error(e);
        alert(e.response?.data?.error || "Erreur lors de la suppression.");
    } finally {
        enSuppression.value = false;
    }
};

const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

const getStatusClass = (status) => {
    switch (status) {
        case 'PUBLIE': return 'bg-green-50 text-green-600 border-green-200';
        case 'VENDU': return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'BROUILLON': return 'bg-gray-50 text-gray-600 border-gray-200';
        default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
};

onMounted(() => {
    chargerObjets();
});
</script>
