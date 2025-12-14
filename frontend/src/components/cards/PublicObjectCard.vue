<template>
  <div class="group bg-white border border-gray-100 hover:border-accent hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      <!-- Overlay Link -->
      <router-link 
        :to="`/catalogue/${objet.id}`"
        class="absolute inset-0 z-10"
      ></router-link>

      <div class="aspect-[4/3] bg-gray-50 overflow-hidden relative">
          <img 
            :src="imageUrl" 
            :alt="objet.titre" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute top-2 right-2 z-20 pointer-events-none">
             <span v-if="objet.type_vente === 'ENCHERE'" class="bg-accent text-white text-[10px] uppercase font-bold px-2 py-1 tracking-wider">
                 Enchère
             </span>
             <span v-else class="bg-text text-white text-[10px] uppercase font-bold px-2 py-1 tracking-wider">
                 Achat Direct
             </span>
          </div>

          <!-- Heart Button (z-30 to sit above link) -->
          <button 
            @click.stop="$emit('toggle-favorite', objet)"
            class="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all z-30 shadow-sm cursor-pointer"
          >
             <i 
              class="fa-heart text-lg transition-colors duration-200"
              :class="isFavorite ? 'fa-solid text-red-500' : 'fa-regular text-gray-400'"
             ></i>
          </button>
      </div>

      <div class="p-4 flex flex-col flex-grow relative pointer-events-none">
          <h3 class="font-serif text-lg text-text mb-1 truncate group-hover:text-accent transition">{{ objet.titre }}</h3>
          <p class="text-xs text-text/50 uppercase tracking-widest mb-3">{{ objet.categorie_nom }}</p>
          
          <div class="mt-auto flex justify-between items-end border-t border-gray-100 pt-3">
              <div>
                  <p class="text-[10px] text-text/50 uppercase">{{ priceLabel }}</p>
                  <p class="text-lg font-bold text-text">
                      {{ formattedPrice }}
                  </p>
              </div>
              <span class="text-accent text-xs font-bold uppercase group-hover:underline">Voir +</span>
          </div>
      </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  objet: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
});

defineEmits(['toggle-favorite']);

const imageUrl = computed(() => {
    if (props.objet.photos_urls) {
        if (Array.isArray(props.objet.photos_urls)) {
            return props.objet.photos_urls[0] || '/placeholder.jpg';
        }
        // Handle potential stringified JSON (fallback)
        if (typeof props.objet.photos_urls === 'string') {
           if (props.objet.photos_urls.startsWith('[')) {
               try { return JSON.parse(props.objet.photos_urls)[0] || '/placeholder.jpg'; } catch(e) {}
           }
           return props.objet.photos_urls;
        }
    }
    return '/placeholder.jpg';
});

const priceLabel = computed(() => props.objet.type_vente === 'ENCHERE' ? 'Prix actuel' : 'Prix');

const formattedPrice = computed(() => {
    const prix = props.objet.type_vente === 'ENCHERE' 
        ? (props.objet.enchere_prix || props.objet.prix_depart)
        : props.objet.prix_achat_immediat;
        
    if (!prix) return 'N/A';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(prix);
});
</script>
