<template>
  <div 
    class="relative h-screen w-full bg-cover bg-center flex items-center justify-center"
    :style="{ backgroundImage: `url(/src/assets/img/illustration.jpg)` }"
  >
    <!-- Dark Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
    
    <!-- Content -->
    <div class="relative z-10 text-center px-6 max-w-5xl mx-auto">
      <h1 class="text-5xl md:text-8xl font-serif text-white mb-6 drop-shadow-2xl tracking-wide">
        {{ title }}
      </h1>
      
      <div class="w-24 h-1 bg-accent mx-auto mb-8"></div>

      <p v-if="subtitle" class="text-lg md:text-2xl text-gray-200 font-light tracking-widest uppercase mb-12">
        {{ subtitle }}
      </p>

      <div v-if="$slots.default" class="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
    default: 'VOS ENCHÈRES'
  },
  subtitle: {
    type: String,
    default: ''
  },
  backgroundImage: {
    type: String,
    required: true,
    default: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop'
  }
})
</script>
