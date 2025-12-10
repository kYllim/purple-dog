<template>
  <div class="flex items-start">
    <div class="flex items-center h-6">
      <input
        :id="checkboxId"
        :name="name"
        type="checkbox"
        :checked="modelValue"
        :required="required"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.checked)"
        class="h-5 w-5 rounded border-text/20 text-accent focus:ring-accent transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
    
    <div class="ml-3 flex-1">
      <label :for="checkboxId" class="text-sm text-text font-sans cursor-pointer">
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </label>
      
      <!-- Link optionnel (ex: "Lire la politique") -->
      <a 
        v-if="link" 
        :href="link" 
        target="_blank"
        class="ml-2 text-sm text-accent hover:text-accent/80 underline transition-colors"
      >
        {{ linkText || 'En savoir plus' }}
      </a>
      
      <!-- Error message -->
      <p v-if="error" class="mt-1 text-sm text-red-600 font-sans">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  linkText: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);

const checkboxId = computed(() => `checkbox-${props.name}`);
</script>