<template>
  <main id="main-content" class="max-w-[1600px] mx-auto px-8 py-12 bg-background">
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      <div id="media-section" class="lg:col-span-2">
          
          <div id="gallery-container" class="bg-white rounded-xl shadow-2xl overflow-hidden mb-8 h-[700px]">
              <div class="relative h-full group">
                  <img class="w-full h-full object-cover" :src="item.photos_urls[0]" :alt="item.titre" />
                  
                  <button 
                      @click="toggleFavorite"
                      :class="['absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg', isFavorite ? 'bg-accent text-white' : 'bg-white/90 hover:bg-accent hover:text-white']"
                      :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                  >
                      <i :class="['fa-solid text-xl', isFavorite ? 'fa-heart' : 'fa-regular fa-heart']"></i>
                  </button>
                  
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-text/60 to-transparent p-6">
                      <div class="flex gap-3">
                          <div v-for="(url, index) in item.photos_urls.slice(0,4)" :key="index" class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-lg border-2 border-white hover:border-accent cursor-pointer transition-all duration-200"></div>
                      </div>
                  </div>
              </div>
          </div>

          <div id="description-section" class="bg-white rounded-xl shadow-lg p-8 mb-8">
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

          <div id="technical-details" class="bg-white rounded-xl shadow-lg p-8 mb-8">
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

          <div id="vendor-section" class="bg-white rounded-xl shadow-lg p-8">
              <h2 class="text-3xl font-extrabold text-text mb-6">Vendeur</h2>
              <div class="border-t border-accent/20 pt-6">
                  <div class="flex items-start justify-between">
                      <div class="flex items-center gap-5">
                          <div class="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                              <i class="fa-solid fa-user text-3xl text-accent"></i>
                          </div>
                          <div>
                              <div class="text-2xl font-bold text-text mb-2">
                                  {{ item.vendeur_type === 'PARTICULIER' ? item.vendeur_prenom + ' M.' : item.vendeur_nom }}
                              </div>
                              <div class="flex items-center gap-3 mb-3">
                                  <div class="flex items-center gap-1 text-accent">
                                      <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                                  </div>
                                  <span class="text-text/70 font-semibold">5.0 (127 avis)</span>
                              </div>
                              <div class="text-text/60">Vendeur {{ item.vendeur_type === 'PARTICULIER' ? 'Particulier' : 'Professionnel' }}</div>
                          </div>
                      </div>
                      <button class="bg-text text-white px-8 py-3 rounded-lg font-bold hover:bg-text/90 transition-all duration-200 shadow-md">
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
import { ref } from 'vue';
// NOTE: Le chemin d'importation de AuctionBox doit être corrigé en fonction de la structure réelle
// (ex: '../components/AuctionBox.vue' si ObjectDetailsPage est dans src/pages)
import AuctionBox from '../components/AuctionBox.vue'; 
// NOTE: 'Icon' est retiré ici car il est maintenant dans le template directement (fa-solid)

// Données de l'utilisateur et de l'objet (Simulées)
const currentUserId = ref('u12345'); 
const hasPaymentMethod = ref(true); // Passez à 'false' pour tester l'alerte Stripe
const isFavorite = ref(false); 

const item = ref({
    titre: 'Vase bleu et blanc de la Dynastie Ming',
    description: "Ce vase exceptionnel de la Dynastie Ming (1368-1644) représente l'apogée de l'art céramique chinois. Orné de motifs de dragons bleus sur fond blanc immaculé, cette pièce rare témoigne du savoir-faire ancestral des maîtres potiers impériaux.",
    vendeur_id: 'v421a', // ID du vendeur (Changez à 'u12345' pour tester le blocage)
    vendeur_prenom: 'Pierre', 
    vendeur_nom: 'Antiquaire Dupont & Fils',
    vendeur_type: 'PARTICULIER', 
    categorie_nom: 'Objets d\'art & tableaux', 
    type_vente: 'ENCHERE', // Basculez entre 'ENCHERE' et 'INSTANTANE'
    statut: 'PUBLIE', 
    
    // Détails techniques
    poids_kg: 3.2,
    dimensions: { longueur: 28, largeur: 28, hauteur: 42, unite: 'cm' },
    photos_urls: ['https://storage.googleapis.com/uxpilot-auth.appspot.com/7f97c758e4-935d57aad5f4c0414f03.png', '/img/photo2.jpg', '/img/photo3.jpg'], 

    // Données de prix
    prix_reserve: 11500.00, 
    prix_achat_immediat: 15900.00,
});

function toggleFavorite() {
    isFavorite.value = !isFavorite.value;
}
</script>
<style scoped>
/* Assurez-vous que les classes de couleur sont définies dans Tailwind: text, background, accent */
/* .accent-accent est une classe Tailwind pour les couleurs de formulaire */
</style>