<template>
  <div
    :class="[
      'rounded-xl border overflow-hidden transition-all duration-300 group',
      item.statut_vente === 'VENDU' || item.statut_vente === 'CLOS'
        ? 'border-gray-200 bg-gray-50 opacity-70'
        : 'border-gray-200 bg-background hover:border-accent/50 hover:-translate-y-0.5',
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
          item.isFavorite ? 'bg-accent' : 'bg-background/90',
        ]"
        @click.stop="handleToggleFavorite"
        :aria-label="item.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
      >
        <Icon
          :icon="item.isFavorite ? 'line-md:heart-filled' : 'line-md:heart'"
          :class="[
            'w-5 h-5 transition-transform duration-200',
            item.isFavorite ? 'text-background' : 'text-accent',
            'group-hover/heart:scale-110',
          ]"
        />
      </button>

      <span
        class="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider"
        :class="
          item.statut_vente === 'VENDU' || item.statut_vente === 'CLOS'
            ? 'bg-gray-700 text-gray-200'
            : 'bg-text text-background'
        "
      >
        {{ getDisplayStatus(item.status, item.statut_vente) }}
      </span>

      <span
        class="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-background/90 text-text backdrop-blur-sm"
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
            {{ getInfoLabel(item.status, item.type_vente) }}
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
        {{ getActionButtonText(item.status, item.type_vente) }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from "@iconify/vue";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggle-favorite']);
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

const getInfoLabel = (status, typeVente) => {
  if (status === 'Proposition envoyée') return 'Votre proposition';
  if (typeVente === 'ENCHERE') return 'Enchère actuelle';
  return 'Prix fixe';
};

const getDisplayStatus = (status, statutVente) => {
  if (status === 'Proposition envoyée') return 'OFFRE ACTIVE';
  if (statutVente === 'VENDU' || statutVente === 'CLOS') return 'VENDU';
  return 'EN VENTE';
};

const getActionButtonText = (status, typeVente) => {
  if (status === 'Proposition envoyée') return 'Voir mon offre';
  if (typeVente === 'ENCHERE') return 'Placer une enchère';
  if (typeVente === 'INSTANTANE') return 'Faire une offre';
  return 'Détails';
};

const handleToggleFavorite = async () => {
  if (isLoadingFavorite.value) return;
  
  isLoadingFavorite.value = true;
  try {
    const utilisateurId = localStorage.getItem('userId');
    
    if (!utilisateurId) {
      // Mode simulation si pas d'utilisateur
      props.item.isFavorite = !props.item.isFavorite;
      emit('toggle-favorite', { objetId: props.item.id, isFavorite: props.item.isFavorite });
      return;
    }

    // Mettre à jour localement AVANT l'appel API pour l'UX
    const ancienEtat = props.item.isFavorite;
    props.item.isFavorite = !props.item.isFavorite;

    const response = await fetch('http://localhost:3000/api/favorites/toggle', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        utilisateur_id: utilisateurId,
        objet_id: props.item.id
      })
    });

    if (response.ok) {
      const result = await response.json();
      emit('toggle-favorite', { objetId: props.item.id, isFavorite: result.isFavorite });
    } else {
      props.item.isFavorite = ancienEtat;
    }
  } catch (err) {
    console.error('Erreur lors du toggle favori:', err);
    // Réinitialiser si erreur
    props.item.isFavorite = !props.item.isFavorite;
  } finally {
    isLoadingFavorite.value = false;
  }
};
</script>