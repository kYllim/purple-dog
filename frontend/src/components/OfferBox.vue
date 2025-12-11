<template>
    <div class="bg-white rounded-xl p-8 mt-6">
        <h3 class="text-xl font-bold text-text mb-4">Faire une offre directe</h3>
        <p class="text-sm text-text/70 mb-4">Proposez un prix au vendeur. Si acceptée, la vente est conclue immédiatement.</p>

        <div v-if="userError" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
            {{ userError }}
        </div>

        <!-- Toast Notification -->
        <Transition name="toast">
            <div v-if="successMessage" class="fixed bottom-10 right-10 bg-white/95 backdrop-blur-xl text-text px-8 py-5 rounded-sm shadow-2xl border-l-4 border-accent flex items-center gap-4 z-[9999] min-w-[300px]">
                <div>
                    <div class="font-serif font-bold text-lg text-accent uppercase tracking-wider">Offre Envoyée</div>
                    <div class="font-medium text-sm">{{ successMessage }}</div>
                </div>
            </div>
        </Transition>

        <div v-if="!authStore.isAuthenticated" class="text-center">
            <router-link to="/connexion" class="text-accent font-bold underline">Se connecter pour faire une offre</router-link>
        </div>

        <div v-else-if="!authStore.isPro" class="text-center bg-red-50 p-4 rounded-lg border border-red-200">
             <p class="text-sm text-red-600 font-bold">Réservé aux Professionnels</p>
             <p class="text-xs text-red-500 mt-1">Seuls les comptes professionnels peuvent faire des offres.</p>
        </div>

        <div v-else>
            <input 
                type="number" 
                placeholder="Montant de votre offre (€)" 
                v-model.number="offerAmount"
                class="w-full px-4 py-3 rounded-lg border-2 border-accent/30 focus:border-accent outline-none font-semibold text-lg mb-4"
            >
            <button 
                @click="makeOffer"
                :disabled="!offerAmount || isLoading"
                class="w-full border-2 border-accent text-accent py-3 rounded-lg font-bold hover:bg-accent hover:text-white transition-all duration-200 disabled:opacity-50"
            >
                {{ isLoading ? 'Envoi...' : 'Envoyer l\'offre' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

const props = defineProps({
    item: { type: Object, required: true },
});

const authStore = useAuthStore();
const offerAmount = ref(null);
const isLoading = ref(false);
const userError = ref('');
const successMessage = ref('');

async function makeOffer() {
    userError.value = '';
    successMessage.value = '';
    isLoading.value = true;

    try {
        await api.makeOffer(props.item.id, offerAmount.value);
        successMessage.value = "Votre offre a été envoyée au vendeur !";
        offerAmount.value = null;
    } catch (err) {
        userError.value = err.response?.data?.error || "Erreur lors de l'envoi de l'offre.";
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
