<template>
  <div class="relative w-full group">
    <label v-if="label" :for="uid" class="block text-sm font-medium text-text/70 mb-1 font-sans group-focus-within:text-accent">
      {{ label }} <span v-if="requis" class="text-red-400">*</span>
    </label>
    <div class="relative">
      <select
        :id="uid"
        :value="modelValue"
        :required="requis"
        :disabled="desactive"
        @change="$emit('update:modelValue', $event.target.value)"
        class="w-full px-4 py-2 bg-white text-text border rounded-lg outline-none transition-all duration-300 appearance-none font-sans focus:ring-1"
        :class="{
          'border-red-500 focus:ring-red-500': erreur,
          'border-text/20 focus:border-accent focus:ring-accent': !erreur,
          'text-text/40': !modelValue,
          'cursor-not-allowed bg-background': desactive
        }"
      >
        <option value="" disabled selected class="text-text/40">{{ placeholder || 'Sélectionner' }}</option>
        <option v-for="opt in options" :key="opt.val" :value="opt.val" class="text-text py-2">
          {{ opt.libelle }}
        </option>
      </select>
      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text/40">▼</div>
    </div>
    <p v-if="erreur" class="text-xs text-red-500 mt-1 ml-1 font-sans">{{ erreur }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  options: { type: Array, default: () => [] },
  placeholder: String,
  requis: Boolean,
  desactive: Boolean,
  erreur: String
})
const uid = 's-' + Math.random().toString(36).substr(2, 9)
defineEmits(['update:modelValue'])
</script>