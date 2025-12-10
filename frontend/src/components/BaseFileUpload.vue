<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-text/70 mb-2 font-sans">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Upload zone -->
    <div
      :class="uploadZoneClasses"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :name="name"
        :accept="accept"
        :required="required"
        @change="handleFileChange"
        class="hidden"
      />

      <!-- Preview si fichier uploadé -->
      <div v-if="preview" class="relative">
        <!-- Preview image -->
        <img
          v-if="isImage"
          :src="preview"
          :alt="fileName"
          class="max-h-40 mx-auto rounded-lg"
        />
        
        <!-- Preview fichier PDF/autre -->
        <div v-else class="flex flex-col items-center">
          <svg class="h-16 w-16 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-2 text-sm font-medium font-sans text-text">{{ fileName }}</p>
        </div>

        <!-- Bouton supprimer -->
        <button
          type="button"
          @click.stop="removeFile"
          class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors duration-200"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Placeholder si pas de fichier -->
      <div v-else class="text-center">
        <svg class="mx-auto h-12 w-12 text-text/40" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="mt-4 flex text-sm text-text/60 font-sans justify-center">
          <span class="relative cursor-pointer rounded-md font-medium text-accent hover:text-accent/80">
            Choisir un fichier
          </span>
          <p class="pl-1">ou glisser-déposer</p>
        </div>
        <p class="text-xs text-text/40 font-sans mt-1">
          {{ accept }} - Maximum {{ maxSizeMB }}MB
        </p>
      </div>
    </div>

    <!-- Hint text -->
    <p v-if="hint && !error" class="mt-2 text-sm text-text/50 font-sans">
      {{ hint }}
    </p>

    <!-- Error message -->
    <p v-if="error" class="mt-2 text-sm text-red-600 font-sans">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [File, null],
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  accept: {
    type: String,
    default: '*'
  },
  maxSizeMB: {
    type: Number,
    default: 10
  },
  required: {
    type: Boolean,
    default: false
  },
  hint: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'error']);

const fileInput = ref(null);
const preview = ref(null);
const fileName = ref('');
const isDragging = ref(false);

const isImage = computed(() => {
  return fileName.value.match(/\.(jpg|jpeg|png|gif|webp)$/i);
});

const uploadZoneClasses = computed(() => {
  const base = 'relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200';
  const hover = 'hover:border-accent/60 hover:bg-accent/5';
  const dragging = isDragging.value ? 'border-accent bg-accent/5' : 'border-text/20';
  const errorClass = props.error ? 'border-red-300 bg-red-50' : '';
  
  return `${base} ${hover} ${dragging} ${errorClass}`;
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    processFile(file);
  }
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    processFile(file);
  }
};

const processFile = (file) => {
  // Vérifier la taille
  const maxSize = props.maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    emit('error', `Le fichier est trop volumineux (max ${props.maxSizeMB}MB)`);
    return;
  }

  fileName.value = file.name;

  // Créer preview si image
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    preview.value = 'file';
  }

  emit('update:modelValue', file);
  emit('error', ''); // Clear error
};

const removeFile = () => {
  preview.value = null;
  fileName.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  emit('update:modelValue', null);
};
</script>