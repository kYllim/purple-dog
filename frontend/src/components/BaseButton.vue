<template>
  <button
    :type="type"
    :disabled="desactive"
    @click="$emit('click')"
    class="relative overflow-hidden transition-all duration-300 font-serif tracking-wide px-6 py-2 rounded-md group"
    :class="[
      variante === 'primaire' 
        ? 'bg-accent text-white hover:bg-accent/90 shadow-lg hover:-translate-y-0.5' 
        : 'border border-accent text-accent hover:bg-accent hover:text-white',
      desactive ? 'opacity-50 cursor-not-allowed transform-none shadow-none' : ''
    ]"
  >
    <span class="relative z-10 flex items-center justify-center gap-2">
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    </span>
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' },
  variante: { type: String, default: 'primaire' },
  desactive: { type: Boolean, default: false }
})
defineEmits(['click'])
</script>