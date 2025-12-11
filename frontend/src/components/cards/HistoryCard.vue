<template>
  <div
    class="bg-white rounded-xl border border-gray-200/70 hover:border-accent/50 hover:-translate-y-0.5'"
  >
    <div class="flex flex-col sm:flex-row items-stretch">
      <div
        class="overflow-hidden w-full aspect-[4/3] sm:aspect-square sm:w-40 sm:h-auto rounded-t-xl sm:rounded-r-none sm:rounded-l-xl flex-shrink-0"
      >
        <img
          class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          :src="item.image"
          :alt="item.titre"
        />
      </div>

      <div
        class="flex-1 flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-4 sm:space-x-6"
      >
        <div class="flex-1 w-full">
          <h3
            class="font-sans font-semibold text-lg sm:text-xl text-text tracking-tight"
          >
            {{ item.titre }}
          </h3>
          <p class="text-gray-500 text-sm italic mt-1">
            {{ item.description_courte }}
          </p>

          <div class="flex items-center space-x-3 mt-3">
            <span
              :class="[
                'text-xs font-medium py-1.5 rounded-full uppercase tracking-wider flex-shrink-0 px-3',
                getStatusClass(),
              ]"
            >
              {{ getStatusLabel() }}
            </span>
          </div>
        </div>

        <div
          class="flex-shrink-0 w-full sm:w-auto text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 sm:pr-6 sm:border-r border-gray-200"
        >
          <div
            :class="[
              'text-3xl sm:text-4xl font-extrabold tracking-tight',
              {
                'text-accent': type === 'achat',
                'text-gray-500': type === 'perte',
              },
            ]"
          >
            {{ formatPrice(item.montant_principal) }}
          </div>
        </div>

        <div
          class="flex flex-row sm:flex-col space-x-3 sm:space-x-0 sm:space-y-3 flex-shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 justify-around sm:justify-start"
        >
          <button
            class="p-2 rounded-full border border-transparent transition-all duration-200 hover:bg-gray-100 hover:border-gray-200 flex items-center justify-center group/heart"
            @click="handleToggleFavorite"
            :aria-label="
              favoritesStore.isFavorite(item.id)
                ? 'Retirer des favoris'
                : 'Ajouter aux favoris'
            "
          >
            <Icon
              :icon="
                favoritesStore.isFavorite(item.id)
                  ? 'line-md:heart-filled'
                  : 'line-md:heart'
              "
              :class="[
                'transition-colors duration-200 w-6 h-6',
                {
                  'text-accent': favoritesStore.isFavorite(item.id),
                  'text-gray-400 group-hover/heart:text-accent':
                    !favoritesStore.isFavorite(item.id),
                },
              ]"
            />
          </button>

          <button
            v-if="type === 'achat'"
            class="p-2 rounded-full border border-transparent transition-all duration-200 hover:bg-gray-100 hover:border-gray-200 flex items-center justify-center group/icon"
            @click=""
          >
            <Icon
              icon="uiw:file-text"
              class="text-gray-500 group-hover/icon:text-text w-6 h-6 transition-colors duration-200"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { useFavoritesStore } from "../../stores/favoritesStore";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ["achat", "perte", "proposition"].includes(value),
  },
});

const router = useRouter();
const favoritesStore = useFavoritesStore();

const getStatusLabel = () => {
  if (props.type === "achat") return "Acheté";
  if (props.type === "perte") return "Enchère perdue";
  if (props.type === "proposition") return "Proposition envoyée";
  return "";
};

const getStatusClass = () => {
  if (props.type === "achat")
    return "border bg-white text-accent border-accent";
  if (props.type === "perte") return "bg-white text-text border-background";
  if (props.type === "proposition")
    return "border bg-white text-text border-text";
  return "";
};

const formatPrice = (value) => {
  if (typeof value !== "number") return "N/A";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const handleToggleFavorite = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  await favoritesStore.toggleFavorite(userId, props.item.id);
};

const goToProduct = () => {
  router.push(`/objet/${props.item.id}`);
};
</script>
