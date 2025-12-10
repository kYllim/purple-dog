<template>
  <PublicLayout>
    <section id="favorites-section" class="mx-12 my-8">
      <div class="flex flex-col sm:flex-col sm:items-start gap-2 mb-8">
        <h2
          class="font-sans text-3xl sm:text-2xl font-extrabold text-text flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 border-b-2 border-accent/20 pb-1"
        >
          Ma liste de souhaits
          <span
            class="font-semibold text-accent bg-accent/10 rounded-full px-3 py-1 text-base tracking-wider flex items-center gap-1 flex-shrink-0"
          >
            {{ favorites.length }} Favoris
          </span>
        </h2>

        <p class="text-sm sm:text-base text-text mt-1">
          Retrouvez ici tous les éléments que vous avez ajoutés à votre liste de
          souhaits.
        </p>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <div
          v-for="(item, index) in favorites"
          :key="index"
          :class="[
            'rounded-xl shadow-lg border overflow-hidden transition-all duration-300 group',
            item.status === 'Plus disponible'
              ? 'border-gray-200 bg-gray-50 opacity-70'
              : 'border-gray-200 bg-background hover:shadow-xl hover:-translate-y-0.5',
          ]"
        >
          <div class="relative h-64 overflow-hidden">
            <img
              :class="[
                'w-full h-full object-cover transition-transform duration-500',
                item.status === 'Plus disponible'
                  ? 'grayscale opacity-80'
                  : 'group-hover:scale-105',
              ]"
              :src="item.image"
              :alt="item.title"
            />

            <button
              :class="[
                'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors group/heart',
                item.favorite ? 'bg-accent' : 'bg-background', // La logique 'hovered' est simulée par l'état 'favorite'
              ]"
              @click.stop="toggleFavorite(index)"
              :aria-label="
                item.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'
              "
            >
              <Icon
                :icon="item.favorite ? 'line-md:heart-filled' : 'line-md:heart'"
                :class="[
                  'w-5 h-5 transition-transform duration-200',
                  item.favorite ? 'text-background' : 'text-accent',
                  // Au survol, on simule l'effet de zoom et de changement de couleur
                  'group-hover/heart:scale-110',
                  item.favorite
                    ? 'group-hover/heart:text-background'
                    : 'group-hover/heart:text-background',
                ]"
              />
            </button>
            <span
              class="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full shadow-md uppercase tracking-wider"
              :class="
                item.status === 'Plus disponible'
                  ? 'bg-gray-700 text-gray-200'
                  : 'bg-text text-background'
              "
            >
              {{ item.status }}
            </span>

            <span
              class="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
              :class="
                item.status === 'Plus disponible'
                  ? 'bg-background/80 text-gray-500'
                  : 'bg-background/90 text-text backdrop-blur-sm'
              "
            >
              {{ item.type }}
            </span>
          </div>

          <div class="p-6 flex flex-col justify-between">
            <div>
              <h3
                class="font-sans text-xl font-bold mb-1 text-text tracking-tight"
              >
                {{ item.title }}
              </h3>
              <p class="text-sm text-gray-500 italic mb-4">
                {{ item.description }}
              </p>
            </div>

            <div
              class="flex items-start justify-between border-t border-gray-200 pt-4"
            >
              <div>
                <p class="text-xs text-gray-500 mb-1 font-medium uppercase">
                  {{ item.infoLabel }}
                </p>
                <p
                  :class="
                    item.status === 'Plus disponible'
                      ? 'text-gray-400 font-extrabold text-2xl'
                      : 'text-accent font-extrabold text-2xl tracking-tight'
                  "
                >
                  {{ item.infoValue }}
                </p>
              </div>

              <div class="text-right" v-if="item.time">
                <p class="text-xs text-gray-500 mb-1 font-medium">
                  Se termine dans
                </p>
                <p class="text-lg font-bold text-text">{{ item.time }}</p>
              </div>
            </div>

            <button
              :disabled="item.status === 'Plus disponible'"
              :class="[
                'mt-6 w-full py-3 rounded-lg font-semibold text-base transition-all duration-300 shadow-md',
                item.status === 'Plus disponible'
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                  : 'bg-accent text-background hover:bg-text hover:shadow-lg',
              ]"
            >
              {{ item.action }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const favorites = ref([
  {
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/fa4fb330b0-9d718bfc872b9bacaf67.png",
    title: "Portrait de Lady Eleanor",
    description: "Période Renaissance, 1642",
    status: "En vente",
    type: "Enchères",
    infoLabel: "Enchère actuelle",
    infoValue: "45 000 €",
    time: "2 j 14 h",
    action: "Placer une enchère",
    favorite: true,
  },
  {
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/84065b5e87-061358753796a6b72603.png",
    title: "Abstract Form VII",
    description: "Sculpture contemporaine",
    status: "En vente",
    type: "Vente rapide",
    infoLabel: "Prix",
    infoValue: "28 500 €",
    action: "Faire une offre",
    favorite: true,
  },
  {
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/8b72df249c-53daf2b0d16e62e2fd29.png",
    title: "Patek Philippe 1953",
    description: "Montre vintage",
    status: "En vente",
    type: "Enchères",
    infoLabel: "Enchère actuelle",
    infoValue: "125 000 €",
    time: "5 j 8 h",
    action: "Placer une enchère",
    favorite: true,
  },
  {
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/c5e0b28a40-4e66b3a62a4b373a5f5c.png",
    title: "Vase dynastie Ming",
    description: "Porcelaine, XVe siècle",
    status: "Plus disponible",
    type: "Vente rapide",
    infoLabel: "Prix final",
    infoValue: "89 000 €",
    action: "Indisponible",
    favorite: false,
  },
]);

function toggleFavorite(index) {
  favorites.value[index].favorite = !favorites.value[index].favorite;
}
</script>
