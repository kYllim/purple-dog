<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg font-medium transition',
      variant === 'primary' && 'bg-accent text-white hover:bg-[#b08e4f]',
      variant === 'secondary' && 'bg-gray-200 text-text hover:bg-gray-300',
      variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700'
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: "primary" }
});
</script>
