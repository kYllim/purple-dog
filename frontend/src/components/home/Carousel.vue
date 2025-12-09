<template>
  <div class="w-full py-24 bg-background">
    <div class="max-w-[1920px] mx-auto">
      <div class="flex justify-between items-end px-6 mb-12 max-w-7xl mx-auto">
        <h2 v-if="title" class="text-3xl font-serif text-text">{{ title }}</h2>
        <div class="flex gap-2">
            <button @click="scroll('left')" class="p-3 border border-text/10 hover:border-accent hover:text-accent transition-colors rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
            <button @click="scroll('right')" class="p-3 border border-text/10 hover:border-accent hover:text-accent transition-colors rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
      </div>
      
      <div 
        ref="scrollContainer"
        class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-6 px-6 pb-4"
        style="scroll-behavior: smooth;"
      >
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="snap-start shrink-0 w-[300px] md:w-[450px] aspect-[4/5] overflow-hidden bg-slate-100 group cursor-pointer relative"
        >
          <img 
            :src="image.src" 
            :alt="image.alt || 'Auction item'" 
            class="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-110"
          />
          <!-- Minimal Overlay -->
          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
          <div class="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
             <p class="font-serif text-2xl mb-1">{{ image.title }}</p>
             <p class="text-xs uppercase tracking-widest">{{ image.description }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  title: {
    type: String,
    default: ''
  },
  images: {
    type: Array,
    default: () => []
  }
});

const scrollContainer = ref(null);

const scroll = (direction) => {
  if (scrollContainer.value) {
    const scrollAmount = 450 + 24;
    scrollContainer.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
