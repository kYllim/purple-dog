<template>
  <section id="historique-section" class="mx-4 sm:mx-8 md:mx-12 my-8">
    <div class="flex flex-col sm:flex-col sm:items-start gap-2 mb-8">
      <h2
        class="font-sans text-3xl sm:text-4xl font-extrabold text-text flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 border-b-2 border-accent/20 pb-1"
      >
        Mon historique
        <span
          class="font-semibold text-accent bg-accent/10 rounded-full px-3 py-1 text-base tracking-wider flex items-center gap-1"
        >
          {{ historique.length }} Transactions
        </span>
      </h2>

      <p class="text-base text-text mt-1">
        Retrouvez ici tous les éléments que vous avez achétés ou sur lesquels
        vous avez enchéri.
      </p>
    </div>
    <div class="space-y-6">
      <div
        v-for="(item, index) in historique"
        :key="index"
        class="bg-background rounded-xl border border-gray-200/70 hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex flex-col sm:flex-row items-stretch">
          <div
            class="overflow-hidden w-full aspect-[4/3] sm:aspect-square sm:w-40 sm:h-auto rounded-t-xl sm:rounded-r-none sm:rounded-l-xl flex-shrink-0"
          >
            <img
              class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              :src="item.image"
              :alt="item.title"
            />
          </div>

          <div
            class="flex-1 flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-4 sm:space-x-6"
          >
            <div class="flex-1 w-full">
              <h3
                class="font-sans font-semibold text-lg sm:text-xl text-text tracking-tight"
              >
                {{ item.title }}
              </h3>
              <p class="text-gray-500 text-sm italic mt-1">
                {{ item.description }}
              </p>

              <div class="flex items-center space-x-3 mt-3">
                <span
                  :class="{
                    'text-xs font-medium py-1.5 rounded-full uppercase tracking-wider flex-shrink-0': true,
                    'border bg-background text-accent border-accent px-3':
                      item.status === 'Acheté',
                    'bg-background text-text border-background px-3':
                      item.status === 'Enchère perdue',
                    'border bg-background text-text border-text px-3':
                      item.status === 'Proposition envoyée',
                  }"
                  >{{ item.status }}</span
                >
                <div class="w-px h-5 bg-gray-200 hidden sm:block"></div>
                <span class="text-gray-500 text-sm font-medium">{{
                  item.date
                }}</span>
              </div>
            </div>

            <div
              class="flex-shrink-0 w-full sm:w-auto text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 sm:pr-6 sm:border-r border-gray-200"
            >
              <div class="flex justify-between sm:block min-h-[4rem]">
                <div>
                  <div class="text-xs text-gray-400 mt-0.5 sm:hidden">
                    {{ item.info }}
                  </div>

                  <div
                    :class="{
                      'text-3xl sm:text-4xl font-extrabold tracking-tight': true,
                      'text-accent':
                        item.status === 'Acheté' ||
                        item.status === 'Proposition envoyée',
                      'text-gray-500': item.status === 'Enchère perdue',
                    }"
                  >
                    {{ item.price }}
                  </div>
                </div>
                <div class="sm:hidden">
                  <div class="text-sm text-gray-400 mt-0.5 hidden sm:block">
                    {{ item.info }}
                  </div>

                  <div
                    v-if="item.extraInfo"
                    :class="{
                      'text-sm font-bold mt-1': true,
                      'text-red-600': item.status === 'Enchère perdue',
                      'text-blue-600': item.status === 'Proposition envoyée',
                    }"
                  >
                    {{ item.extraInfo }}
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-400 mt-0.5 hidden sm:block">
                {{ item.info }}
              </div>

              <div
                v-if="item.extraInfo"
                :class="{
                  'text-sm font-bold mt-1 hidden sm:block': true,
                  'text-text': item.status === 'Enchère perdue',
                  'text-text': item.status === 'Proposition envoyée',
                }"
              >
                {{ item.extraInfo }}
              </div>
            </div>

            <div
              class="flex flex-row sm:flex-col space-x-3 sm:space-x-0 sm:space-y-3 flex-shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 justify-around sm:justify-start"
            >
              <button
                class="p-2 rounded-full border border-transparent transition-all duration-200 hover:bg-gray-100 hover:border-gray-200 flex items-center justify-center group/heart"
                @click="toggleFavorite(index)"
                :aria-label="
                  item.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'
                "
              >
                <Icon
                  :icon="
                    item.favorite ? 'line-md:heart-filled' : 'line-md:heart'
                  "
                  :class="[
                    'transition-colors duration-200 w-6 h-6',
                    {
                      'text-accent': item.favorite,
                      'text-gray-400 group-hover/heart:text-accent':
                        !item.favorite, // Maintient l'effet de couleur au survol
                    },
                  ]"
                />
              </button>

              <button
                class="p-2 rounded-full border border-transparent transition-all duration-200 hover:bg-gray-100 hover:border-gray-200 hidden sm:block flex items-center justify-center group/icon"
              >
                <Icon
                  icon="mdi:download"
                  class="text-gray-500 group-hover/icon:text-text w-6 h-6 transition-colors duration-200"
                />
              </button>

              <button
                class="p-2 rounded-full border border-transparent transition-all duration-200 hover:bg-gray-100 hover:border-gray-200 flex items-center justify-center group/icon"
              >
                <Icon
                  icon="uiw:file-text"
                  class="text-gray-500 group-hover/icon:text-text w-6 h-6 transition-colors duration-200"
                />
              </button>

              <button
                class="p-2 rounded-full border border-transparent transition-all duration-200 hover:bg-red-50 hover:border-red-200 flex items-center justify-center"
                v-if="item.showRemove"
              >
                <Icon
                  icon="mdi:close"
                  class="text-red-500 w-6 h-6 transition-colors duration-200"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

// ... (Script inchangé)
const historique = ref([
  {
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/1bf9e1260c-4fa46e479db654d59fbf.png",
    title: "Paysage Impressionniste",
    description: "UX Pilot Monet, 1890",
    status: "Acheté",
    date: "15 mars 2024",
    price: "45,000€",
    info: "Enchère gagnante",
    favorite: true,
    showRemove: false,
  },
  {
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/eaf229fd3a-f57428a6bec2a210cfe0.png",
    title: "Coffret à Bijoux Ancien",
    description: "Argent massif, XIXe siècle",
    status: "Enchère perdue",
    date: "8 mars 2024",
    price: "3,200€",
    info: "Votre enchère",
    extraInfo: "Vendu à 3,500€",
    favorite: false,
    showRemove: false,
  },
  {
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/85e64fbb75-74005060cee336fb5b5a.png",
    title: "Stylo-plume Montblanc",
    description: "Édition limitée, 1995",
    status: "Proposition envoyée",
    date: "2 mars 2024",
    price: "1,800€",
    info: "Votre proposition",
    extraInfo: "En attente",
    favorite: true,
    showRemove: true,
  },
]);

function toggleFavorite(index) {
  historique.value[index].favorite = !historique.value[index].favorite;
}
</script>
