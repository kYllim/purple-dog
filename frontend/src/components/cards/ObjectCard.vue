<template>
  <div
    class="rounded-xl shadow-lg border overflow-hidden transition-all duration-300 group border-gray-200 bg-background hover:shadow-xl hover:-translate-y-0.5"
  >
    <div class="relative h-64 overflow-hidden">
      <!-- Image Principale -->
      <img
        :class="['w-full h-full object-cover transition-transform duration-500 group-hover:scale-105', item.statut === 'VENDU' ? 'grayscale opacity-70' : '']"
        :src="imageUrl"
        :alt="item.titre"
      />

       <!-- Badge VENDU -->
      <div v-if="item.statut === 'VENDU'" class="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <span class="px-6 py-2 bg-red-600 text-white font-bold text-lg uppercase tracking-widest -rotate-12 shadow-lg border-2 border-white">VENDU</span>
      </div>

      <!-- Bouton Edit (top right) -->
      <button
        v-if="item.statut !== 'VENDU'"
        class="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors group/edit bg-background hover:bg-accent z-20"
        @click.stop="$emit('edit', item)"
        title="Modifier"
      >
        <i class="fa-solid fa-pen w-4 h-4 text-accent group-hover/edit:text-white transition-colors"></i>
      </button>

      <!-- Type de vente -->
      <span
        class="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-background/90 text-text backdrop-blur-sm z-20"
      >
        {{ item.type_vente === 'ENCHERE' ? 'Enchères' : 'Vente directe' }}
      </span>
    </div>

    <div class="p-6 flex flex-col justify-between h-[320px]" :class="{ 'opacity-60 grayscale': item.statut === 'VENDU' }">
      <div>
        <h3 class="font-sans text-xl font-bold mb-1 text-text tracking-tight line-clamp-1">
          {{ item.titre }}
        </h3>
        <p class="text-sm text-gray-500 italic mb-4 line-clamp-2 min-h-[40px]">
          {{ item.description }}
        </p>
      </div>

      <div class="flex items-start justify-between border-t border-gray-200 pt-4 mt-auto">
        <div>
          <p class="text-xs text-gray-500 mb-1 font-medium uppercase">
            {{ priceLabel }}
          </p>
          <p class="text-accent font-extrabold text-2xl tracking-tight">
            {{ displayPrice }} €
          </p>
        </div>

        <div class="text-right" v-if="timeRemaining">
          <p class="text-xs text-gray-500 mb-1 font-medium">Se termine dans</p>
          <p class="text-lg font-bold text-text">{{ timeRemaining }}</p>
        </div>
      </div>

       <button
          v-if="item.statut !== 'VENDU'"
          class="mt-6 w-full py-3 rounded-lg font-semibold text-base transition-all duration-300 shadow-md bg-accent text-background hover:bg-text hover:shadow-lg"
          @click.stop="$emit('manage', item)"
        >
          Gérer l'annonce
        </button>
        <button
          v-else
          disabled
          class="mt-6 w-full py-3 rounded-lg font-semibold text-base bg-gray-200 text-gray-500 cursor-not-allowed"
        >
          Objet Vendu
        </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const imageUrl = computed(() => {
    if (props.item.photos_urls && props.item.photos_urls.length > 0) {
        // Gérer le cas où c'est un tableau JSON stocké en string ou un tableau JS
        if (typeof props.item.photos_urls === 'string') {
            try {
                 const parsed = JSON.parse(props.item.photos_urls);
                 return parsed[0] || 'https://via.placeholder.com/400x300?text=No+Image';
            } catch (e) {
                return props.item.photos_urls; // Si c'est juste une URL string
            }
        }
        return props.item.photos_urls[0];
    }
    return 'https://via.placeholder.com/400x300?text=No+Image';
});

const priceLabel = computed(() => {
    return props.item.type_vente === 'ENCHERE' ? 'Prix de départ' : 'Prix';
});

const displayPrice = computed(() => {
    if (props.item.type_vente === 'ENCHERE') {
        return props.item.prix_depart;
    }
    return props.item.prix_achat_immediat || props.item.prix_souhaite;
});

const timeRemaining = computed(() => {
    // TODO: Calculer le temps restant réel si enchère
    if (props.item.type_vente === 'ENCHERE') {
        return '2 j 14 h'; // Mock
    }
    return null;
});

</script>
