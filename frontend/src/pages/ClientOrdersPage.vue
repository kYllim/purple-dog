<template>
  <PublicLayout>
    <div class="max-w-6xl mx-auto px-6 py-12 mt-20 min-h-screen">
      <h1 class="text-4xl font-serif text-text mb-8 uppercase tracking-widest border-b border-accent/20 pb-4">
          Mon Historique d'Achats
      </h1>

      <div v-if="loading" class="flex justify-center py-20">
          <i class="fa-solid fa-circle-notch fa-spin text-4xl text-accent"></i>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-20 bg-gray-50 rounded-lg">
          <i class="fa-solid fa-bag-shopping text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Aucune commande pour le moment.</p>
          <router-link to="/catalogue" class="inline-block mt-4 px-6 py-2 bg-accent text-white rounded hover:bg-black transition-colors">
              Parcourir le catalogue
          </router-link>
      </div>

      <div v-else class="space-y-6">
          <div v-for="order in orders" :key="order.id" class="bg-white border boundary-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col md:flex-row">
              <!-- Image -->
              <div class="w-full md:w-48 h-48 bg-gray-100 flex-shrink-0">
                  <img 
                    :src="getMainPhoto(order)" 
                    class="w-full h-full object-cover" 
                    alt="Photo objet"
                  >
              </div>

              <!-- Details -->
              <div class="p-6 flex-grow flex flex-col justify-between">
                  <div>
                      <div class="flex justify-between items-start mb-2">
                          <h3 class="text-xl font-bold font-serif">{{ order.objet_titre }}</h3>
                          <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                              {{ order.statut_paiement }}
                          </span>
                      </div>
                      <p class="text-gray-500 text-sm mb-4 line-clamp-2">{{ order.description }}</p>
                  </div>
                  
                  <div class="flex items-end justify-between border-t border-gray-100 pt-4">
                      <div class="text-sm text-gray-500">
                          Commandé le : <span class="text-gray-900 font-medium">{{ formatDate(order.cree_le) }}</span>
                      </div>
                      <div class="text-right">
                          <div class="text-xs text-gray-500 uppercase">Montant Total</div>
                          <div class="text-2xl font-bold text-accent">{{ order.montant_total }} €</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { paymentService } from '../services/paymentService';
import PublicLayout from '../layouts/PublicLayout.vue';

const loading = ref(true);
const orders = ref([]);

onMounted(async () => {
    try {
        orders.value = await paymentService.getMyOrders();
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
});

const getMainPhoto = (order) => {
    if (order.photos_urls && order.photos_urls.length > 0) {
        if (typeof order.photos_urls === 'string') {
             try { return JSON.parse(order.photos_urls)[0]; } catch(e){ return order.photos_urls }
        }
        return order.photos_urls[0];
    }
    return 'https://via.placeholder.com/150';
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};
</script>
