<template>
  <div
    :class="[
      'rounded-xl border overflow-hidden transition-all duration-300 group',
      item.statut_vente === 'VENDU' || item.statut_vente === 'CLOS'
        ? 'border-gray-200 bg-gray-50 opacity-70'
        : 'border-gray-200 bg-white hover:border-accent/50 hover:-translate-y-0.5',
    ]"
  >
    <div class="relative h-64 overflow-hidden">
      <img
        :class="[
          'w-full h-full object-cover transition-transform duration-500',
          item.statut_vente === 'VENDU' || item.statut_vente === 'CLOS'
            ? 'grayscale opacity-80'
            : 'group-hover:scale-105',
        ]"
        :src="item.image"
        :alt="item.titre"
      />

      <button
        :class="[
          'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors group/heart',
          favoritesStore.isFavorite(item.id) ? 'bg-accent' : 'bg-white/90',
        ]"
        @click.stop="handleToggleFavorite"
        :aria-label="favoritesStore.isFavorite(item.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'"
      >
        <Icon
          :icon="favoritesStore.isFavorite(item.id) ? 'line-md:heart-filled' : 'line-md:heart'"
          :class="[
            'w-5 h-5 transition-transform duration-200',
            favoritesStore.isFavorite(item.id) ? 'text-background' : 'text-accent',
            'group-hover/heart:scale-110',
          ]"
        />
      </button>

      <span
        class="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider"
        :class="
          item.statut_vente === 'VENDU' || item.statut_vente === 'CLOS'
            ? 'bg-gray-700 text-gray-200'
            : 'bg-green-600 text-white'
        "
      >
        {{ getDisplayStatus(item.statut_vente) }}
      </span>

      <span
        class="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-text backdrop-blur-sm"
      >
        {{ item.type_vente === 'ENCHERE' ? 'Enchères' : 'Vente rapide' }}
      </span>
    </div>

    <div class="p-6 flex flex-col justify-between">
      <div>
        <h3 class="font-sans text-xl font-bold mb-1 text-text tracking-tight">
          {{ item.titre }}
        </h3>
        <p class="text-sm text-gray-500 italic mb-4">
          {{ item.description_courte || 'Description non disponible.' }}
        </p>
      </div>

      <div
        class="flex items-start justify-between border-t border-gray-200 pt-4"
      >
        <div>
          <p class="text-xs text-gray-500 mb-1 font-medium uppercase">
            {{ getInfoLabel(item.type_vente) }}
          </p>
          <p
            :class="
              item.statut_vente === 'VENDU' || item.statut_vente === 'CLOS'
                ? 'text-gray-400 font-extrabold text-2xl'
                : 'text-accent font-extrabold text-2xl tracking-tight'
            "
          >
            {{ formatPrice(item.montant_principal) }}
          </p>
        </div>

        <div class="text-right" v-if="item.type_vente === 'ENCHERE' && item.time_remaining">
          <p class="text-xs text-gray-500 mb-1 font-medium">
            Se termine dans
          </p>
          <p class="text-lg font-bold text-text">{{ item.time_remaining }}</p>
        </div>
      </div>

      <button
        :disabled="item.statut_vente === 'VENDU' || item.statut_vente === 'CLOS'"
        :class="[
          'mt-6 w-full py-3 rounded-lg font-semibold text-base transition-all duration-300',
          item.statut_vente === 'VENDU' || item.statut_vente === 'CLOS'
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-accent text-background hover:bg-text',
        ]"
      >
        {{ getActionButtonText(item.type_vente) }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from "@iconify/vue";
import { useFavoritesStore } from '../../stores/favoritesStore';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const favoritesStore = useFavoritesStore();
const isLoadingFavorite = ref(false);

const formatPrice = (value) => {
  if (typeof value !== 'number') return 'N/A';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const getInfoLabel = (typeVente) => {
  if (typeVente === 'ENCHERE') return 'Enchère actuelle';
  return 'Prix fixe';
};

const getDisplayStatus = (statutVente) => {
  if (statutVente === 'VENDU' || statutVente === 'CLOS') return 'PLUS DISPONIBLE';
  return 'EN VENTE';
};

const getActionButtonText = (typeVente) => {
  if (typeVente === 'ENCHERE') return 'Placer une enchère';
  if (typeVente === 'INSTANTANE') return 'Faire une offre';
  return 'Détails';
};

const handleToggleFavorite = async () => {
  if (isLoadingFavorite.value) return;
  
  isLoadingFavorite.value = true;
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    await favoritesStore.toggleFavorite(userId, props.item.id);
  } catch (err) {
    console.error('Erreur lors du toggle favori:', err);
  } finally {
    isLoadingFavorite.value = false;
  }
};
</script>