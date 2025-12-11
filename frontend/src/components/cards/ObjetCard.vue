<template>
  <div
    :class="[
      'rounded-xl shadow-lg border overflow-hidden transition-all duration-300 group',
      status === 'Plus disponible'
        ? 'border-gray-200 bg-gray-50 opacity-70'
        : 'border-gray-200 bg-background hover:shadow-xl hover:-translate-y-0.5',
    ]"
  >
    <!-- IMAGE -->
    <div class="relative h-64 overflow-hidden">
      <img
        :class="[
          'w-full h-full object-cover transition-transform duration-500',
          status === 'Plus disponible'
            ? 'grayscale opacity-80'
            : 'group-hover:scale-105',
        ]"
        :src="image"
        :alt="title"
      />

      <!-- FAVORI -->
      <button
        class="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors group/heart"
        @click.stop="toggleFavorite"
        :class="favorite ? 'bg-accent' : 'bg-background'"
      >
        <Icon
          :icon="favorite ? 'line-md:heart-filled' : 'line-md:heart'"
          :class="[favorite ? 'text-background' : 'text-accent', 'w-5 h-5']"
        />
      </button>

      <!-- BADGE STATUT -->
      <span
        class="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full shadow-md uppercase tracking-wider"
        :class="status === 'Plus disponible' ? 'bg-gray-700 text-gray-200' : 'bg-text text-background'"
      >
        {{ status }}
      </span>

      <!-- BADGE TYPE -->
      <span
        class="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
        :class="status === 'Plus disponible'
          ? 'bg-background/80 text-gray-500'
          : 'bg-background/90 text-text backdrop-blur-sm'"
      >
        {{ type }}
      </span>
    </div>

    <!-- CONTENU -->
    <div class="p-6 flex flex-col justify-between">

      <div>
        <h3 class="text-xl font-bold text-text mb-1">
          {{ title }}
        </h3>

        <p class="text-sm text-gray-500 italic mb-4">
          {{ description }}
        </p>
      </div>

      <!-- PRIX / ENCHÈRE -->
      <div class="flex items-start justify-between border-t border-gray-200 pt-4">

        <div>
          <p class="text-xs text-gray-500 mb-1 font-medium uppercase">
            {{ infoLabel }}
          </p>
          <p
            :class="status === 'Plus disponible'
              ? 'text-gray-400 font-extrabold text-2xl'
              : 'text-accent font-extrabold text-2xl'"
          >
            {{ infoValue }}
          </p>
        </div>

        <div v-if="time" class="text-right">
          <p class="text-xs text-gray-500 mb-1 font-medium">Se termine dans</p>
          <p class="text-lg font-bold text-text">{{ time }}</p>
        </div>

      </div>

      <button
        :disabled="status === 'Plus disponible'"
        :class="[
          'mt-6 w-full py-3 rounded-lg font-semibold text-base transition-all duration-300 shadow-md',
          status === 'Plus disponible'
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-accent text-background hover:bg-text hover:shadow-lg',
        ]"
        @click="actionClick"
      >
        {{ action }}
      </button>

    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  image: String,
  title: String,
  description: String,
  status: String,
  type: String,
  infoLabel: String,
  infoValue: String,
  time: String,
  action: String,
  favorite: Boolean,
});

const emit = defineEmits(['toggle-favorite', 'action']);

const toggleFavorite = () => emit('toggle-favorite');
const actionClick = () => emit('action');
</script>
