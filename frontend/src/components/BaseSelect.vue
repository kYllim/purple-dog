<template>
  <div class="relative w-full group">
    <label v-if="label" :for="uid" class="block text-sm font-medium text-[#0F172A]/70 mb-1 group-focus-within:text-[#C5A059]">
      {{ label }} <span v-if="requis" class="text-red-400">*</span>
    </label>
    <div class="relative">
      <select
        :id="uid"
        :value="modelValue"
        :required="requis"
        :disabled="desactive"
        @change="$emit('update:modelValue', $event.target.value)"
        class="w-full px-4 py-2 bg-white text-[#0F172A] border border-gray-200 rounded-lg outline-none transition-all duration-300 appearance-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] font-sans"
        :class="{'border-red-500': erreur, 'text-gray-400': !modelValue}"
      >
        <option value="" disabled selected>{{ placeholder || 'Selectionner' }}</option>
        <option v-for="opt in options" :key="opt.val" :value="opt.val" class="text-[#0F172A] py-2">{{ opt.libelle }}</option>
      </select>
      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
    </div>
    <p v-if="erreur" class="text-xs text-red-500 mt-1 ml-1">{{ erreur }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  options: { type: Array, default: () => [] }, // Format attendu: [{ libelle: 'A', val: 'a' }]
  placeholder: String,
  requis: Boolean,
  desactive: Boolean,
  erreur: String
})
const uid = 's-' + Math.random().toString(36).substr(2, 9)
defineEmits(['update:modelValue'])
</script>
