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
                    <Icon icon="mdi:alert-circle-outline" class="text-accent text-xl mt-1" />
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
                <div v-if="offers.length > 0" class="space-y-3">
                    <div v-for="(offer, index) in offers" :key="index" class="flex items-center justify-between py-2 border-b" :class="{'border-accent/10': index < offers.length - 1}">
                        <div class="font-semibold text-text">{{ offer.name }}</div>
                        <div class="font-bold" :class="{'text-accent': offer.isHighest, 'text-text': !offer.isHighest}">{{ formatPrice(offer.amount) }}</div>
                    </div>
                </div>
                <div v-else class="text-center py-4">
                    <p class="text-text/60">Aucune enchère pour le moment</p>
                </div>
            </div>
        </div>


        <div v-else-if="item.type_vente === 'INSTANTANE'" id="buyout-mode">
            
            <div class="mb-8">
                <div class="text-sm font-semibold text-text/60 mb-2">PRIX DEMANDÉ</div>
                <div class="text-5xl font-extrabold text-accent mb-6">{{ formatPrice(item.prix_achat_immediat) }}</div>
            </div>

            <div class="mb-6 border-t border-b border-gray-200 py-4 text-sm">
                <div class="flex justify-between mb-2">
                    <span class="text-text/80">Prix de l'objet :</span>
                    <span class="font-medium text-text">{{ formatPrice(item.prix_achat_immediat) }}</span>
                </div>
                <div class="flex justify-between mb-2">
                    <span class="text-text/80">Commission plateforme (3%) :</span> 
                    <span class="font-medium text-text">{{ formatPrice(commissionAcheteur) }}</span>
                </div>
                <div class="flex justify-between font-bold mt-3 border-t border-accent/20 pt-3">
                    <span class="text-text">Montant total estimé (hors livraison) :</span>
                    <span class="text-accent">{{ formatPrice(montantTotalEstime) }}</span>
                </div>
            </div>
            
            <div class="bg-accent/5 rounded-lg p-3 mb-6 border border-accent/20">
                <p class="text-xs text-text font-semibold flex items-center">
                    <Icon icon="mdi:alert-circle-outline" class="text-accent text-lg mr-2" />
                    L'acheteur dispose de 24h pour "Valider l'achat" après avoir remporté l'objet.
                </p>
            </div>


            <button 
                @click="makeQuickPurchase"
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
                    <Icon icon="mdi:shield-check" class="text-accent text-lg" />
                    <div class="leading-relaxed">
                        Paiement sécurisé via Stripe. Garantie de remboursement si l'objet ne correspond pas à la description.
                    </div>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 mt-6">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <Icon icon="mdi:truck-fast" class="text-accent text-2xl" />
                    <div>
                        <div class="font-bold text-text">Livraison assurée</div>
                        <div class="text-sm text-text/60">Estimation : 3-5 jours</div>
                    </div>
                </div>
                <div class="font-bold text-accent">Gratuit</div>
            </div>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <Icon icon="mdi:undo" class="text-accent text-2xl" />
                    <div>
                        <div class="font-bold text-text">Retour accepté</div>
                        <div class="text-sm text-text/60">Sous 14 jours</div>
                    </div>
                </div>
                <Icon icon="mdi:check-circle" class="text-accent text-xl" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Icon } from '@iconify/vue'; 

const props = defineProps({
    item: { type: Object, required: true },
    currentUserId: String, 
    hasPaymentMethod: Boolean, 
});

// --- État Local ---
const currentPrice = ref(0); 
const nextBid = ref(0); 
const isAutoBid = ref(false);
const auctionEndsIn = ref('Chargement...');
const offers = ref([]);

// --- Logique Métier et Calculs ---

const isSeller = computed(() => {
    if (!props.currentUserId || !props.item) return false;
    return props.item.vendeur_id === props.currentUserId;
});

const minBidStep = 50; 
const minNextBid = computed(() => currentPrice.value + minBidStep); 

const quickSteps = computed(() => {
    return [50, 100, 250]; 
});

// Logique de Commission pour Vente Rapide
const COMMISSION_TAUX_ACHETEUR = 0.03; 

const commissionAcheteur = computed(() => {
    return props.item.prix_achat_immediat * COMMISSION_TAUX_ACHETEUR;
});

const montantTotalEstime = computed(() => {
    return props.item.prix_achat_immediat + commissionAcheteur.value;
});

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
        currentPrice.value = nextBid.value;
        nextBid.value = currentPrice.value + minBidStep;
    } else {
        alert(`Le montant minimum est ${formatPrice(minNextBid.value)}.`);
    }
}

function makeQuickPurchase() {
    alert("Achat immédiat lancé. Redirection vers le paiement.");
}

async function loadAuctionData() {
    try {
        if (props.item.type_vente === 'ENCHERE' && props.item.id) {
            // Récupérer les enchères pour cet objet
            const response = await fetch(
                `http://localhost:3000/api/encheres/${props.item.id}`
            );
            
            if (response.ok) {
                const data = await response.json();
                // Les enchères contiendraient les données historiques
                // Pour l'instant, on initialise avec le prix souhaité
                currentPrice.value = props.item.prix_souhaite || 0;
                nextBid.value = currentPrice.value + minBidStep;
            }
        } else if (props.item.type_vente === 'INSTANTANE') {
            currentPrice.value = props.item.prix_achat_immediat || 0;
        }
    } catch (err) {
        console.error('Erreur chargement enchères:', err);
        currentPrice.value = props.item.prix_souhaite || props.item.prix_achat_immediat || 0;
    }
}

watch(() => props.item, (newItem) => {
    if (newItem) {
        loadAuctionData();
        // Initialiser nextBid
        nextBid.value = currentPrice.value + minBidStep;
    }
}, { immediate: true });

onMounted(() => {
    loadAuctionData();
});
</script>

<style scoped>
</style>