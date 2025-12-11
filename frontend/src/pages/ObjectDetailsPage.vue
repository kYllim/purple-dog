<template>
  <main id="main-content" class="max-w-[1600px] mx-auto px-4 sm:px-8 py-12 bg-background">
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      <div id="media-section" class="lg:col-span-2">
          
          <div id="gallery-container" class="bg-white rounded-xl overflow-hidden mb-8 h-[700px]">
              <div class="relative h-full group">
                  
                  <img 
                      :key="currentImage" 
                      class="w-full h-full object-cover transition-opacity duration-300" 
                      :src="currentImage" 
                      :alt="item.titre" 
                  />
                  
                  <button 
                      @click="navigateImage(-1)"
                      class="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/70 text-text group-hover:opacity-100 hover:bg-accent hover:text-white transition-opacity duration-200 flex items-center justify-center"
                      aria-label="Image précédente"
                  >
                      <Icon icon="ic:round-chevron-left" class="text-3xl" />
                  </button>
                  
                  <button 
                      @click="navigateImage(1)"
                      class="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/70 text-text group-hover:opacity-100 hover:bg-accent hover:text-white transition-opacity duration-200 flex items-center justify-center"
                      aria-label="Image suivante"
                  >
                      <Icon icon="ic:round-chevron-right" class="text-3xl" />
                  </button>

                  <button 
                      @click="toggleFavorite"
                      :class="['absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200', isFavorite ? 'bg-accent text-white' : 'bg-white/90 hover:bg-accent hover:text-white']"
                      :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                  >
                      <Icon :icon="isFavorite ? 'line-md:heart-filled' : 'line-md:heart'" class="text-xl" />
                  </button>
                  
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-text/60 to-transparent p-6">
                      <div class="flex gap-3 overflow-x-auto pb-2"> 
                          <div 
                              v-for="(url, index) in item.photos_urls" 
                              :key="index"
                              @mouseenter="currentImage = url"
                              @click="currentImage = url"
                              :class="[
                                  'w-20 h-20 bg-white/20 backdrop-blur-sm rounded-lg border-2 flex-shrink-0 cursor-pointer transition-all duration-200',
                                  url === currentImage ? 'border-accent' : 'border-white/50 hover:border-accent'
                              ]"
                          >
                            <img :src="url" :alt="`Vue ${index + 1}`" class="w-full h-full object-cover rounded-md"/>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          
          <h1 class="text-4xl sm:text-5xl font-extrabold text-text mb-4 tracking-tight">{{ item.titre }}</h1>
          
          <div class="flex items-center gap-4 mb-8 pb-4 border-b border-gray-200">
              <span 
                  :class="['text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full', item.type_vente === 'ENCHERE' ? 'bg-accent/10 text-accent' : 'bg-text/10 text-text']"
              >
                  {{ item.type_vente === 'ENCHERE' ? 'Enchères en cours' : 'Vente immédiate' }}
              </span>
              <span class="text-sm font-semibold text-text/70">
                  Statut : <span :class="{'text-accent': item.statut === 'PUBLIE', 'text-text/50': item.statut !== 'PUBLIE'}">{{ item.statut }}</span>
              </span>
              <span class="text-sm font-semibold text-text/70">
                  Catégorie : {{ item.categorie_nom }}
              </span>
          </div>
          <div id="description-section" class="bg-white rounded-xl p-8 mb-8">
              <h2 class="text-3xl font-extrabold text-text mb-6">Description & Authenticité</h2>
              <div class="border-t border-accent/20 pt-6">
                  <p class="text-lg leading-relaxed text-text/80 mb-6">{{ item.description }}</p>
                  
                  <div v-if="item.documents_urls && item.documents_urls.length" class="bg-accent/5 rounded-lg p-6 border border-accent/20">
                      <h3 class="text-xl font-bold text-accent mb-4">Documents Officiels</h3>
                      <p class="text-text/80 leading-relaxed">
                          Le certificat d'authenticité et d'autres documents ({{ item.documents_urls.join(', ') }}) accompagnent l'objet, attestant de son origine et de sa période.
                      </p>
                  </div>
              </div>
          </div>

          <div id="technical-details" class="bg-white rounded-xl p-8 mb-8">
              <h2 class="text-3xl font-extrabold text-text mb-6">Détails Techniques</h2>
              <div class="border-t border-accent/20 pt-6">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      <div class="flex items-start gap-4">
                          <div class="w-2 h-2 bg-accent rounded-full mt-2"></div>
                          <div>
                              <div class="font-bold text-text mb-1">Dimensions</div>
                              <div class="text-text/70">{{ item.dimensions.longueur }} x {{ item.dimensions.largeur }} x {{ item.dimensions.hauteur }} cm</div>
                          </div>
                      </div>
                      <div class="flex items-start gap-4">
                          <div class="w-2 h-2 bg-accent rounded-full mt-2"></div>
                          <div>
                              <div class="font-bold text-text mb-1">Poids</div>
                              <div class="text-text/70">{{ item.poids_kg }} kg</div>
                          </div>
                      </div>
                      <div class="flex items-start gap-4">
                          <div class="w-2 h-2 bg-accent rounded-full mt-2"></div>
                          <div>
                              <div class="font-bold text-text mb-1">Catégorie</div>
                              <div class="text-text/70">{{ item.categorie_nom }}</div>
                          </div>
                      </div>
                      <div class="flex items-start gap-4">
                          <div class="w-2 h-2 bg-accent rounded-full mt-2"></div>
                          <div>
                              <div class="font-bold text-text mb-1">État</div>
                              <div class="text-text/70">Excellent</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div id="vendor-section" class="bg-white rounded-xl p-8">
              <h2 class="text-3xl font-extrabold text-text mb-6">Vendeur</h2>
              <div class="border-t border-accent/20 pt-6">
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                          <div class="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                              <Icon icon="mdi:user-circle" class="text-3xl text-accent" />
                          </div>
                          <div>
                              <div class="text-2xl font-bold text-text mb-1">
                                  {{ item.vendeur_type === 'PARTICULIER' ? item.vendeur_prenom + ' M.' : item.vendeur_nom }}
                              </div>
                    
                              <div class="text-text/60">Vendeur {{ item.vendeur_type === 'PARTICULIER' ? 'Particulier' : 'Professionnel' }}</div>
                          </div>
                      </div>
                      <button class="bg-text text-white px-8 py-3 rounded-lg font-bold hover:bg-text/90 transition-all duration-200 w-full sm:w-auto">
                          Contacter
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <div id="auction-box-wrapper" class="lg:col-span-1">
          <div class="sticky top-12">
              <AuctionBox 
                  :item="item" 
                  :current-user-id="currentUserId"
                  :has-payment-method="hasPaymentMethod"
                  :initial-price="12450"
                  :auction-ends-in="'2 jours 14 heures'"
              />
          </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'; 
import AuctionBox from '../components/AuctionBox.vue'; 
import { Icon } from '@iconify/vue'; 

// Données de l'utilisateur et de l'objet (Simulées)
const currentUserId = ref('u12345'); 
const hasPaymentMethod = ref(true); 
const isFavorite = ref(false); 
const currentImage = ref(''); 

const item = ref({
    titre: 'Vase bleu et blanc de la Dynastie Ming',
    description: "Ce vase exceptionnel de la Dynastie Ming (1368-1644) représente l'apogée de l'art céramique chinois. Orné de motifs de dragons bleus sur fond blanc immaculé, cette pièce rare témoigne du savoir-faire ancestral des maîtres potiers impériaux.",
    vendeur_id: 'v421a', 
    vendeur_prenom: 'Pierre', 
    vendeur_nom: 'Antiquaire Dupont & Fils',
    vendeur_type: 'PARTICULIER', 
    categorie_nom: 'Objets d\'art & tableaux', 
    type_vente: 'ENCHERE', 
    statut: 'PUBLIE', // OBJETS.statut
    
    // Détails techniques
    poids_kg: 3.2,
    dimensions: { longueur: 28, largeur: 28, hauteur: 42, unite: 'cm' },
    photos_urls: [
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/7f97c758e4-935d57aad5f4c0414f03.png', 
        '/img/photo2_arriere.jpg', 
        '/img/photo3_dessus.jpg', 
        '/img/photo4_dessous.jpg', 
        '/img/photo5_signature.jpg', 
        '/img/photo6_tranche.jpg', 
        '/img/photo7_detail1.jpg', 
        '/img/photo8_detail2.jpg', 
        '/img/photo9_context.jpg', 
        '/img/photo10_certificat.jpg'
    ], 

    // Données de prix
    prix_reserve: 11500.00, 
    prix_achat_immediat: 15900.00,
});

function toggleFavorite() {
    isFavorite.value = !isFavorite.value;
}

// Logique pour trouver l'index de l'image actuelle
const currentImageIndex = computed(() => {
  return item.value.photos_urls.findIndex(url => url === currentImage.value);
});

// FONCTION DE NAVIGATION (pour les flèches)
function navigateImage(direction) { // direction: +1 pour suivant, -1 pour précédent
    const urls = item.value.photos_urls;
    const currentIndex = currentImageIndex.value;
    
    if (urls.length === 0) return;

    let newIndex = currentIndex + direction;

    // Gestion du bouclage
    if (newIndex >= urls.length) {
        newIndex = 0; // Retour à la première
    } else if (newIndex < 0) {
        newIndex = urls.length - 1; // Aller à la dernière
    }

    currentImage.value = urls[newIndex];
}

// Initialise l'image principale au chargement du composant
onMounted(() => {
    if (item.value.photos_urls.length > 0) {
        currentImage.value = item.value.photos_urls[0];
    }
});
</script>

<style scoped>
</style>