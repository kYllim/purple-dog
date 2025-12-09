<template>
  <div class="w-full">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="inputId" 
      class="block text-sm font-medium text-text/70 mb-2 font-sans"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Input wrapper pour icon (optionnel) -->
    <div class="relative">
      <!-- Icon gauche -->
      <div 
        v-if="iconLeft" 
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component :is="iconLeft" class="h-5 w-5 text-text/40" />
      </div>

      <!-- Input -->
      <input
        :id="inputId"
        :type="type"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />

      <!-- Icon droite (ex: toggle password) -->
      <div 
        v-if="iconRight" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        @click="$emit('icon-click')"
      >
        <component :is="iconRight" class="h-5 w-5 text-text/40 hover:text-text/60 transition-colors" />
      </div>
    </div>

    <!-- Hint text -->
    <p v-if="hint && !error" class="mt-1 text-sm text-text/50 font-sans">
      {{ hint }}
    </p>

    <!-- Error message -->
    <p v-if="error" class="mt-1 text-sm text-red-600 font-sans">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  iconLeft: {
    type: Object,
    default: null
  },
  iconRight: {
    type: Object,
    default: null
  }
});

defineEmits(['update:modelValue', 'blur', 'focus', 'icon-click']);

const inputId = computed(() => `input-${props.name}`);

const inputClasses = computed(() => {
  const base = 'block w-full rounded-lg border-0 py-3 px-4 text-text font-sans shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset transition-all duration-200';
  
  const padding = props.iconLeft ? 'pl-10' : props.iconRight ? 'pr-10' : '';
  
  const state = props.error 
    ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500' 
    : 'ring-text/20 placeholder:text-text/40 focus:ring-accent';
  
  const disabledClass = props.disabled ? 'bg-background cursor-not-allowed' : 'bg-white';
  
  return `${base} ${padding} ${state} ${disabledClass}`;
});
</script>