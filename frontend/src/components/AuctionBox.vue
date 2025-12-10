<template>
    <div class="bg-white rounded-xl p-8">
        <div v-if="item.type_vente === 'ENCHERE'" id="auction-mode">
            
            <div class="mb-6">
                <div class="text-sm font-semibold text-text/60 mb-2">ENCHÈRE ACTUELLE</div>
                <div class="text-5xl font-extrabold text-accent mb-4">{{ formatPrice(currentPrice) }}</div>
                
                <div class="bg-accent/10 rounded-lg px-4 py-3 border border-accent/30">
                    <div class="text-accent font-bold">Fin de l'enchère : {{ auctionEndsIn }}</div>
                </div>
            </div>

            <div v-if="isSeller || !hasPaymentMethod" 
                 :class="['bg-accent/5 rounded-lg p-5 border mb-6', isSeller ? 'border-text/20' : 'border-accent/20']"
            >
                <div class="flex items-start gap-3">
                    <i class="fa-solid fa-info-circle text-accent text-xl mt-1"></i>
                    <div class="text-sm text-text leading-relaxed">
                        <span v-if="isSeller" class="font-bold">Erreur : Vous êtes le vendeur de cet objet. L'auto-enchère est interdite.</span>
                        <span v-else-if="!hasPaymentMethod" class="font-bold">Action Requise :</span> Vous devez configurer votre compte Stripe pour participer aux enchères.
                    </div>
                </div>
            </div>
            
            <div :class="{'opacity-50 pointer-events-none': isSeller || !hasPaymentMethod}">
                <div class="mb-6">
                    <div class="text-sm font-bold text-text mb-3">PALIERS RAPIDES (Min. {{ formatPrice(minNextBid) }})</div>
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
                        :placeholder="`Montant personnalisé (Min: ${formatPrice(minNextBid)})`" 
                        v-model.number="nextBid"
                        class="w-full px-4 py-3 rounded-lg border-2 border-accent/30 focus:border-accent outline-none font-semibold text-lg mb-4"
                    >
                    
                    <label class="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" v-model="isAutoBid" class="w-5 h-5 accent-accent cursor-pointer">
                        <span class="text-sm font-semibold text-text">Enchère automatique maximale</span>
                    </label>
                </div>

                <button 
                    @click="placeBid"
                    :disabled="nextBid < minNextBid"
                    class="w-full bg-accent text-white py-4 rounded-lg font-extrabold text-lg hover:bg-text transition-all duration-200 mb-6 disabled:bg-gray-400"
                >
                    Placer mon offre
                </button>
            </div>

            <div>
                <div class="text-sm font-bold text-text mb-4">HISTORIQUE DES OFFRES</div>
                <div class="space-y-3">
                    <div v-for="(offer, index) in offers" :key="index" class="flex items-center justify-between py-2 border-b" :class="{'border-accent/10': index < offers.length - 1}">
                        <div class="font-semibold text-text">{{ offer.name }}</div>
                        <div class="font-bold" :class="{'text-accent': offer.isHighest, 'text-text': !offer.isHighest}">{{ formatPrice(offer.amount) }}</div>
                    </div>
                </div>
            </div>
        </div>


        <div v-else-if="item.type_vente === 'INSTANTANE'" id="buyout-mode">
            
            <div class="mb-8">
                <div class="text-sm font-semibold text-text/60 mb-2">PRIX D'ACHAT IMMÉDIAT</div>
                <div class="text-5xl font-extrabold text-accent mb-6">{{ formatPrice(item.prix_achat_immediat) }}</div>
            </div>

            <button 
                :disabled="!hasPaymentMethod"
                class="w-full bg-accent text-white py-4 rounded-lg font-extrabold text-lg hover:bg-text transition-all duration-200 mb-6 disabled:bg-gray-400"
            >
                Acheter immédiatement
            </button>

            <div class="text-center">
                <a href="#" class="text-accent font-semibold underline hover:text-text transition-colors duration-200">
                    Faire une offre de prix
                </a>
            </div>

            <div class="mt-8 pt-6 border-t border-accent/20">
                <div class="flex items-start gap-3 text-sm text-text/70">
                    <i class="fa-solid fa-shield-halved text-accent text-lg"></i>
                    <div class="leading-relaxed">
                        Paiement sécurisé via Stripe. Garantie de remboursement si l'objet ne correspond pas à la description.
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    item: { type: Object, required: true },
    currentUserId: String, 
    hasPaymentMethod: Boolean, // Statut Stripe
    initialPrice: { type: Number, default: 0 }, // Le prix affiché au chargement (Enchère actuelle)
    auctionEndsIn: { type: String, default: 'Date inconnue' },
});

// --- État Local Simulé (Pour la réactivité de l'enchère) ---
const currentPrice = ref(props.initialPrice);
const nextBid = ref(0);
const isAutoBid = ref(false);

// --- Propriétés Calculées ---
const isSeller = computed(() => props.item.vendeur_id === props.currentUserId);
const minBidStep = 50; // Simulation du pas minimum (à remplacer par la logique réelle de CdC)
const minNextBid = computed(() => currentPrice.value + minBidStep);

const quickSteps = computed(() => {
    // Calcul des paliers rapides (utilisés dans le template)
    return [minBidStep, minBidStep * 2, minBidStep * 5];
});

// Historique simulé (Doit venir de ENCHERES_OFFRES)
const offers = ref([
    { name: 'Marie L.', amount: 12450, isHighest: true },
    { name: 'Jean D.', amount: 12300, isHighest: false },
    { name: 'Sophie R.', amount: 12100, isHighest: false },
    { name: 'Marc P.', amount: 12000, isHighest: false },
]);

// --- Fonctions d'Action ---
function formatPrice(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function setBidAmount(step) {
    nextBid.value = currentPrice.value + step;
}

function placeBid() {
    if (nextBid.value >= minNextBid.value) {
        console.log(`Nouvelle offre placée: ${nextBid.value}. Auto-bid: ${isAutoBid.value}`);
        // Logique API pour enregistrer l'offre (ENCHERES_OFFRES)
        // Simulation de la mise à jour :
        currentPrice.value = nextBid.value;
        nextBid.value = currentPrice.value + minBidStep;
        // La nouvelle offre devrait être ajoutée à offers.value (via WebSockets/SSE)
    } else {
        alert(`Le montant minimum est ${formatPrice(minNextBid.value)}.`);
    }
}

// Initialisation du champ de saisie
nextBid.value = minNextBid.value;
</script>