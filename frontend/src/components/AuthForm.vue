<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4 py-12">
    <div class="w-full" :class="containerClass">
      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-accent/10">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-serif text-text">{{ title }}</h1>
          <p v-if="subtitle" class="mt-2 text-sm text-text/60 font-sans">{{ subtitle }}</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Slot pour le contenu du formulaire -->
          <slot :form="form" :errors="errors" :loading="loading" />

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium font-sans text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span v-if="!loading">{{ submitText }}</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loadingText }}
            </span>
          </button>

          <!-- Slot pour contenu après le bouton (liens, etc.) -->
          <slot name="footer" />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  submitText: {
    type: String,
    default: 'Soumettre'
  },
  loadingText: {
    type: String,
    default: 'Chargement...'
  },
  initialData: {
    type: Object,
    default: () => ({})
  },
  maxWidth: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl', '3xl'].includes(value)
  }
});

const emit = defineEmits(['submit']);

const form = ref({ ...props.initialData });
const errors = ref({});
const loading = ref(false);

const containerClass = computed(() => {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl'
  };
  return maxWidths[props.maxWidth] || maxWidths.md;
});

const handleSubmit = async () => {
  errors.value = {};
  loading.value = true;

  try {
    await emit('submit', form.value, { setErrors, setLoading });
  } catch (error) {
    console.error('Form submission error:', error);
  } finally {
    // Le loading sera géré par setLoading dans le parent
  }
};

const setErrors = (newErrors) => {
  errors.value = newErrors;
};

const setLoading = (value) => {
  loading.value = value;
};

// Exposer les méthodes pour le parent
defineExpose({
  form,
  errors,
  loading,
  setErrors,
  setLoading
});
</script>