<template>
    <div class="bg-white rounded-xl p-8">
        <div v-if="item.type_vente === 'ENCHERE'" id="auction-mode">
            
            <div class="mb-6">
                <div class="text-sm font-semibold text-text/60 mb-2">ENCHÈRE ACTUELLE</div>
                <div class="text-5xl font-extrabold text-accent mb-4">{{ formatPrice(currentPrice) }}</div>
                
                <div class="bg-accent/10 rounded-lg px-4 py-3 border border-accent/30 relative overflow-hidden">
                    <div class="text-accent font-bold">Fin de l'enchère : {{ timerString }}</div>
                    
                     <Transition name="fade">
                        <div v-if="isWinning" class="absolute top-0 right-0 m-2 px-3 py-1 rounded-sm font-bold text-[10px] uppercase tracking-widest shadow-lg backdrop-blur-md bg-accent text-white border border-white/20">
                            Vous menez
                        </div>
                     </Transition>
                </div>
            </div>

            <div v-if="userError" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                {{ userError }}
            </div>

            <Transition name="toast">
                <div v-if="successMessage" class="fixed bottom-10 right-10 bg-white/95 backdrop-blur-xl text-text px-8 py-5 rounded-sm shadow-2xl border-l-4 border-accent flex items-center gap-4 z-[9999] min-w-[300px]">
                    <div>
                        <div class="font-serif font-bold text-lg text-accent uppercase tracking-wider">Succès</div>
                        <div class="font-medium text-sm">{{ successMessage }}</div>
                    </div>
                </div>
            </Transition>

            <div :class="{'opacity-50 pointer-events-none': !canBid}">
                <div class="mb-6">
                    <div class="text-sm font-bold text-text mb-3">PALIERS RAPIDES</div>
                    <div class="flex gap-3 mb-4">
                        <button v-for="step in quickSteps" :key="step"
                            @click="setBidAmount(step)"
                            class="flex-1 py-3 px-4 rounded-lg border-2 border-accent/50 text-accent font-bold hover:bg-accent hover:text-white transition-all duration-200"
                        >
                            +{{ formatPrice(step) }}
                        </button>
                    </div>
                    
                    <input 
                        type="number" 
                        :placeholder="`Montant (Min: ${formatPrice(minNextBid)})`" 
                        v-model.number="nextBid"
                        class="w-full px-4 py-3 rounded-lg border-2 border-accent/30 focus:border-accent outline-none font-semibold text-lg mb-4"
                    >
                    
                    <label class="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" v-model="isAutoBid" class="w-5 h-5 accent-accent cursor-pointer">
                        <span class="text-sm font-semibold text-text">Enchère automatique maximale</span>
                    </label>
                </div>

                <div v-if="!authStore.isAuthenticated" class="mb-4 text-center">
                    <p class="text-sm text-text/70 mb-2">Connectez-vous pour enchérir</p>
                    <router-link to="/connexion" class="text-accent font-bold underline">Se connecter</router-link>
                </div>

                <div v-else-if="!authStore.isPro" class="mb-4 text-center bg-red-50 p-4 rounded-lg border border-red-200">
                     <p class="text-sm text-red-600 font-bold">Réservé aux Professionnels</p>
                     <p class="text-xs text-red-500 mt-1">Les particuliers ne peuvent que vendre.</p>
                </div>

                <button 
                    v-else
                    @click="placeBid"
                    :disabled="nextBid < minNextBid || isLoading"
                    class="w-full bg-accent text-white py-4 rounded-lg font-extrabold text-lg hover:bg-text transition-all duration-200 mb-6 disabled:bg-gray-400"
                >
                    {{ isLoading ? 'Envoi...' : 'Placer mon offre' }}
                </button>
            </div>
        </div>

        <div v-else-if="item.type_vente === 'INSTANTANE'" id="buyout-mode">
             <div class="mb-8">
                <div class="text-sm font-semibold text-text/60 mb-2">PRIX D'ACHAT IMMÉDIAT</div>
                <div class="text-5xl font-extrabold text-accent mb-6">{{ formatPrice(item.prix_achat_immediat) }}</div>
            </div>
        </div>
        

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

const props = defineProps({
    item: { type: Object, required: true },
});

const authStore = useAuthStore();

const currentPrice = ref(props.item.enchere_prix_actuel ? parseFloat(props.item.enchere_prix_actuel) : (props.item.prix_depart || 0));
const currentLeaderId = ref(props.item.leader_id);
const endDate = ref(props.item.enchere_fin ? new Date(props.item.enchere_fin) : null);
const nextBid = ref(0);
const isAutoBid = ref(false);
const isLoading = ref(false);
const userError = ref('');
const successMessage = ref('');
const timerString = ref('--j --h --m --s');

const isSeller = computed(() => authStore.user?.userId === props.item.vendeur_id);
const isWinning = computed(() => {
    if (!authStore.isAuthenticated || !authStore.user?.userId || !currentLeaderId.value) return false;
    return String(authStore.user.userId) === String(currentLeaderId.value);
});
const hasPaymentMethod = computed(() => true); 
const canBid = computed(() => authStore.isAuthenticated && authStore.isPro && !isSeller.value && hasPaymentMethod.value && !isAuctionEnded.value);

const minBidStep = computed(() => {
    if (currentPrice.value < 100) return 10;
    if (currentPrice.value < 500) return 50;
    return 100;
});

const minNextBid = computed(() => {
    if (isWinning.value) return currentPrice.value;
    return currentPrice.value + minBidStep.value;
});

const quickSteps = computed(() => [minBidStep.value, minBidStep.value * 2, minBidStep.value * 5]);

const isAuctionEnded = computed(() => endDate.value && new Date() > endDate.value);

watch(() => props.item, (newVal) => {
    if (newVal.enchere_prix_actuel) currentPrice.value = parseFloat(newVal.enchere_prix_actuel);
    if (newVal.enchere_fin) endDate.value = new Date(newVal.enchere_fin);
    if (newVal.leader_id !== undefined) currentLeaderId.value = newVal.leader_id;
    updateTimer();
}, { deep: true });

watch(minNextBid, (newMin) => {
    if (nextBid.value === 0) {
        nextBid.value = newMin;
    }
}, { immediate: true });


function formatPrice(value) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
}

function setBidAmount(step) {
    nextBid.value = currentPrice.value + step;
}

async function placeBid() {
    userError.value = '';
    successMessage.value = '';
    isLoading.value = true;

    try {
        const response = await api.placeBid(props.item.id, nextBid.value, isAutoBid.value ? nextBid.value : null);
        successMessage.value = "Offre placée avec succès !";
        currentPrice.value = response.data.nouveau_prix;
        currentLeaderId.value = authStore.user.userId;
        if (response.data.fin) endDate.value = new Date(response.data.fin);
    } catch (err) {
        userError.value = err.response?.data?.error || "Une erreur est survenue.";
    } finally {
        isLoading.value = false;
    }
}

let timerInterval;

function updateTimer() {
    if (!endDate.value) return;
    const now = new Date();
    const diff = endDate.value - now;

    if (diff <= 0) {
        timerString.value = "Terminé";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    timerString.value = `${days}j ${hours}h ${minutes}m ${seconds}s`;
}

let eventSource;

onMounted(() => {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);

    eventSource = new EventSource('http://localhost:3000/events');
    
    eventSource.addEventListener('bid_update', (event) => {
        const data = JSON.parse(event.data);
        if (data.objetId === props.item.id) {
            currentPrice.value = parseFloat(data.nouveauPrix);
            if (data.nouvelleFin) endDate.value = new Date(data.nouvelleFin);
            if (data.encherisseurId) currentLeaderId.value = data.encherisseurId;
            successMessage.value = "Une nouvelle offre a été placée !";
            setTimeout(() => successMessage.value = '', 3000);
        }
    });

    eventSource.addEventListener('auction_end', (event) => {
        const data = JSON.parse(event.data);
        if (data.objetId === props.item.id) {
            timerString.value = "Terminé";
        }
    });
});

onUnmounted(() => {
    clearInterval(timerInterval);
    if (eventSource) eventSource.close();
});
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