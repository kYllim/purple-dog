<template>
  <PublicLayout>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        
        <div v-if="loading">
            <i class="fa-solid fa-circle-notch fa-spin text-4xl text-accent mb-4"></i>
            <h2 class="text-xl font-bold">Confirmation de votre commande...</h2>
            <p class="text-gray-500 mt-2">Veuillez patienter quelques instants.</p>
        </div>

        <div v-else-if="success">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="fa-solid fa-check text-4xl text-green-500"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Paiement Réussi !</h1>
            <p class="text-gray-600 mb-8">
                Merci pour votre achat. L'objet a été marqué comme vendu et le vendeur va être notifié.
            </p>
            <router-link to="/particulier/mes-objets" class="block w-full py-3 bg-accent text-white rounded-lg font-bold hover:bg-black transition-colors">
                Voir mes commandes
            </router-link>
            <!-- Note: Ideally link to "My Orders", but "My Objects" or Home is fine for MVP -->
        </div>

        <div v-else>
            <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="fa-solid fa-xmark text-4xl text-red-500"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Échec de la validation</h1>
            <p class="text-gray-600 mb-8">
                Nous n'avons pas pu confirmer le paiement.
            </p>
            <router-link to="/" class="text-accent underline">Retour à l'accueil</router-link>
        </div>

      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { paymentService } from '../services/paymentService';
import PublicLayout from '../layouts/PublicLayout.vue';

const route = useRoute();
const loading = ref(true);
const success = ref(false);

onMounted(async () => {
    const sessionId = route.query.session_id;
    const objetId = route.query.objet_id;

    if (!sessionId || !objetId) {
        loading.value = false;
        return;
    }

    try {
        await paymentService.confirmPayment(objetId, sessionId);
        success.value = true;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
});
</script>
