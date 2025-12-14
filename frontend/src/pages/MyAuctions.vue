<template>
  <PublicLayout>
    <main class="max-w-[1600px] mx-auto px-8 pt-32 pb-12 min-h-screen">
      
      <div class="flex items-center justify-between mb-12">
        <h1 class="text-4xl font-serif text-text uppercase tracking-widest">Mes Enchères</h1>
        <div class="text-sm text-text/60">
             Suivez vos enchères en temps réel
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
         <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>

      <div v-else-if="auctions.length === 0" class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
         <h2 class="text-2xl font-bold text-text mb-2">Aucune enchère en cours</h2>
         <p class="text-text/60 mb-6">Vous n'avez pas encore participé à des enchères.</p>
         <router-link to="/" class="px-6 py-3 bg-accent text-white font-bold rounded hover:bg-black transition-colors">
            Parcourir le catalogue
         </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <div 
            v-for="auction in auctions" 
            :key="auction.id"
            class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100"
         >
            <div class="relative h-64 overflow-hidden">
                 <img 
                    :src="auction.photo_principale || '/placeholder.jpg'" 
                    :alt="auction.titre"
                    class="w-full h-full object-cover"
                 />
                 
                 <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                 
                 <div class="absolute top-4 right-4 px-4 py-2 rounded-sm font-bold text-xs uppercase tracking-widest shadow-lg backdrop-blur-md"
                      :class="auction.is_winning ? 'bg-accent text-white' : 'bg-red-600 text-white'"
                 >
                     {{ auction.is_winning ? 'Vous menez' : 'Surenchéri' }}
                 </div>

                 <div class="absolute bottom-4 left-4 px-3 py-1 bg-white/90 text-text text-xs uppercase tracking-widest font-bold rounded-sm">
                     {{ auction.categorie_nom }}
                 </div>
            </div>
            <div class="p-6">
                <router-link :to="`/encheres/${auction.objet_id}`" class="block mb-4">
                    <h3 class="text-xl font-serif text-text font-bold truncate group-hover:text-accent transition-colors">{{ auction.titre }}</h3>
                </router-link>

                <div class="flex justify-between items-end border-t border-gray-100 pt-4">
                    <div>
                        <div class="text-xs text-text/50 uppercase font-bold mb-1">Prix Actuel</div>
                        <div class="text-2xl font-bold text-accent">{{ formatPrice(auction.prix_actuel) }}</div>
                    </div>
                    <div class="text-right">
                         <div class="text-xs text-text/50 uppercase font-bold mb-1">Fin dans</div>
                         <div class="text-sm font-medium text-text bg-gray-100 px-3 py-1 rounded">
                             {{ getTimeRemaining(auction.date_fin) }}
                         </div>
                    </div>
                </div>

                <div class="mt-6">
                     <router-link 
                        :to="`/encheres/${auction.objet_id}`"
                        class="block w-full py-3 text-center border-2 font-bold rounded-sm transition-colors uppercase text-xs tracking-widest"
                        :class="auction.is_winning ? 'border-accent text-accent hover:bg-accent hover:text-white' : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'"
                     >
                        {{ auction.is_winning ? 'Voir l\'enchère' : 'Surenchérissez !' }}
                     </router-link>
                </div>
            </div>
         </div>
      </div>

    </main>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import api from '../services/api';
import PublicLayout from '../layouts/PublicLayout.vue';

const auctions = ref([]);
const isLoading = ref(true);
let timerInterval;

const fetchAuctions = async () => {
    try {
        const response = await api.get('/objets/mes-encheres');
        auctions.value = response.data;
    } catch (error) {
        console.error("Failed to fetch auctions", error);
    } finally {
        isLoading.value = false;
    }
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

const getTimeRemaining = (dateStr) => {
    if (!dateStr) return '--';
    const end = new Date(dateStr);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return 'Terminé';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}j ${hours}h`;
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
};

const startTimer = () => {
    timerInterval = setInterval(() => {
        fetchAuctions(); 
    }, 5000);
};

onMounted(() => {
    fetchAuctions();
    startTimer();
});

onUnmounted(() => {
    clearInterval(timerInterval);
});
</script>
