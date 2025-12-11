<template>
  <PublicLayout>
      <main id="main-content" class="max-w-[1600px] mx-auto px-8 pt-32 pb-12 bg-background min-h-screen">
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center h-[500px]">
            <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
        </div>

        <div v-else-if="item" class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <!-- Left Column: Media & Details (8/12) -->
          <div id="media-section" class="lg:col-span-8 space-y-12">
              
              
              <!-- Main Gallery -->
              <div id="gallery-container" class="bg-white rounded-sm shadow-2xl overflow-hidden relative group border border-gray-100">
                  <div class="aspect-[4/3] w-full bg-gray-50 relative">
                       <img 
                          v-if="currentImage"
                          :key="currentImage" 
                          class="w-full h-full object-contain p-4" 
                          :src="currentImage" 
                          :alt="item.titre" 
                      />
                  </div>
                  
                  <!-- Thumbnail Strip -->
                  <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-100"> 
                      <div 
                          v-for="(url, index) in item.photos_urls" 
                          :key="index"
                          @mouseenter="currentImage = url"
                          @click="currentImage = url"
                          :class="[
                              'w-12 h-12 rounded-full border-2 flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-300',
                              url === currentImage ? 'border-accent scale-110 ring-2 ring-accent/20' : 'border-transparent hover:border-accent/50'
                          ]"
                      >
                        <img :src="url" :alt="`Vue ${index + 1}`" class="w-full h-full object-cover"/>
                      </div>
                  </div>
              </div>

              <!-- Title & Header (Moved below image) -->
              <div class="border-b border-accent/20 pb-6 text-center">
                  <h1 class="text-4xl md:text-5xl font-serif text-text mb-2 uppercase tracking-wide">{{ item.titre }}</h1>
                  <p class="text-accent text-lg font-medium tracking-widest uppercase">{{ item.categorie_nom }}</p>
              </div>

              <!-- Content Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                  
                  <!-- Description -->
                  <div id="description-section" class="md:col-span-2 space-y-6">
                      <div class="flex items-center gap-4 mb-4">
                          <div class="h-px bg-accent/30 flex-grow"></div>
                          <h2 class="text-2xl font-serif text-text uppercase tracking-widest text-center px-4">Authenticité & Histoire</h2>
                          <div class="h-px bg-accent/30 flex-grow"></div>
                      </div>
                      
                      <div class="prose prose-lg text-text/80 text-justify leading-loose font-light">
                           {{ item.description }}
                      </div>

                      <div v-if="item.documents_urls && item.documents_urls.length" class="mt-6 p-6 bg-[#FAF9F6] border border-accent/10 rounded-sm flex items-start gap-4">
                          <span class="text-2xl pt-1 text-accent">✦</span>
                          <div>
                              <h3 class="font-serif text-lg font-bold text-text mb-1 uppercase tracking-wide">Certificat d'Authenticité</h3>
                              <p class="text-sm text-text/60 italic">Les documents officiels et expertises sont disponibles pour cet objet.</p>
                          </div>
                      </div>
                  </div>

                  <!-- Details Techniques -->
                  <div id="technical-details" class="md:col-span-2">
                       <div class="flex items-center gap-4 mb-8">
                          <div class="h-px bg-accent/30 flex-grow"></div>
                          <h2 class="text-2xl font-serif text-text uppercase tracking-widest text-center px-4">Caractéristiques</h2>
                          <div class="h-px bg-accent/30 flex-grow"></div>
                      </div>

                      <div class="grid grid-cols-3 gap-6 text-center">
                          <div class="p-6 border border-gray-100 bg-white hover:border-accent/30 transition-colors duration-300 shadow-sm">
                              <div class="font-serif text-2xl text-accent mb-2">{{ item.dimensions?.longueur || '-' }}</div>
                              <div class="text-xs uppercase tracking-widest text-text/50 font-bold">Longueur (cm)</div>
                          </div>
                          <div class="p-6 border border-gray-100 bg-white hover:border-accent/30 transition-colors duration-300 shadow-sm">
                              <div class="font-serif text-2xl text-accent mb-2">{{ item.poids_kg }}</div>
                              <div class="text-xs uppercase tracking-widest text-text/50 font-bold">Poids (kg)</div>
                          </div>
                          <div class="p-6 border border-gray-100 bg-white hover:border-accent/30 transition-colors duration-300 shadow-sm">
                              <div class="font-serif text-2xl text-accent mb-2">{{ item.dimensions?.hauteur || '-' }}</div>
                              <div class="text-xs uppercase tracking-widest text-text/50 font-bold">Hauteur (cm)</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Right Column: Sticky Action Box (4/12) -->
          <div id="auction-box-wrapper" class="lg:col-span-4 relative">
              <div class="sticky top-32 space-y-8">
                  <AuctionBox :item="item" class="shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-t-4 border-accent" />
                  <OfferBox :item="item" class="shadow-lg border border-gray-100" />
                  
                  <!-- Reassurance / Trust Signals -->
                  <div class="text-center space-y-4 pt-8 opacity-70">
                      <div class="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-text/60">
                          <span class="w-1 h-1 bg-accent rounded-full"></span>
                          Expertisé par PurpleDog
                          <span class="w-1 h-1 bg-accent rounded-full"></span>
                      </div>
                      <div class="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-text/60">
                           <span class="w-1 h-1 bg-accent rounded-full"></span>
                          Paiement Sécurisé
                          <span class="w-1 h-1 bg-accent rounded-full"></span>
                      </div>
                  </div>
              </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="text-center py-20">
            <div class="inline-block p-10 bg-white shadow-2xl border-t-4 border-red-800">
                <h2 class="text-3xl font-serif text-red-800 mb-4 uppercase tracking-widest">Objet Indisponible</h2>
                <p class="text-text/70 mb-6 italic">{{ error || "Nous ne parvenons pas à récupérer les détails de cet objet." }}</p>
                
                 <div class="py-4 border-t border-gray-100 mt-4 text-left">
                     <p class="text-xs text-gray-400 font-mono">
                        ERR_ID: {{ route.params.id }}<br>
                        API_STAT: {{ apiStatus }}
                    </p>
                </div>

                <router-link to="/" class="mt-6 inline-block px-8 py-3 bg-text text-white text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors">
                    Retour au Catalogue
                </router-link>
            </div>
        </div>
      </main>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'; 
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import PublicLayout from '../layouts/PublicLayout.vue';
import AuctionBox from '../components/AuctionBox.vue'; 
import OfferBox from '../components/OfferBox.vue';

const route = useRoute();
const router = useRouter();
const item = ref(null);
const currentImage = ref('');
const isLoading = ref(true);
const error = ref('');
const apiStatus = ref('Init');

onMounted(async () => {
    const objectId = route.params.id;
    apiStatus.value = `Fetching ${objectId}...`;
    if (objectId) {
        try {
            const response = await api.get(`/objets/${objectId}`);
            item.value = response.data;
            apiStatus.value = 'Success';
            
            // Logic to enforce URL strictness
            const isAuction = item.value.type_vente === 'ENCHERE';
            const isAuctionRoute = route.path.startsWith('/encheres');

            if (isAuction && !isAuctionRoute) {
                router.replace(`/encheres/${objectId}`);
            } else if (!isAuction && isAuctionRoute) {
                router.replace(`/objets/${objectId}`);
            }

            if (item.value && item.value.photos_urls && item.value.photos_urls.length > 0) {
                currentImage.value = item.value.photos_urls[0];
            }
        } catch (err) {
            console.error("Erreur chargement objet", err);
            error.value = err.response?.data?.error || err.message;
            apiStatus.value = `Error: ${error.value}`;
        } finally {
            isLoading.value = false;
        }
    } else {
        error.value = "ID manquant dans l'URL";
        isLoading.value = false;
    }
});
</script>