<template>
  <div
    class="rounded-xl shadow-lg border overflow-hidden transition-all duration-300 group border-gray-200 bg-background hover:shadow-xl hover:-translate-y-0.5"
  >
    <div class="relative h-64 overflow-hidden">
      <!-- Image Principale -->
      <img
        :class="['w-full h-full object-cover transition-transform duration-500 group-hover:scale-105']"
        :src="imageUrl"
        :alt="item.titre"
      />

      <!-- Bouton Edit (top right) -->
      <button
        class="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors group/edit bg-background hover:bg-accent"
        @click.stop="$emit('edit', item)"
        title="Modifier"
      >
        <i class="fa-solid fa-pen w-4 h-4 text-accent group-hover/edit:text-white transition-colors"></i>
      </button>

      <!-- Statut -->
      <span
        class="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full shadow-md uppercase tracking-wider"
         :class="item.statut === 'VENDU' ? 'bg-gray-700 text-gray-200' : 'bg-text text-background'"
      >
        {{ item.statut || 'En vente' }}
      </span>

      <!-- Type de vente -->
      <span
        class="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-background/90 text-text backdrop-blur-sm"
      >
        {{ item.type_vente === 'ENCHERE' ? 'Enchères' : 'Vente directe' }}
      </span>
    </div>

    <div class="p-6 flex flex-col justify-between h-[320px]">
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
          class="mt-6 w-full py-3 rounded-lg font-semibold text-base transition-all duration-300 shadow-md bg-accent text-background hover:bg-text hover:shadow-lg"
          @click.stop="$emit('manage', item)"
        >
          Gérer l'annonce
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
