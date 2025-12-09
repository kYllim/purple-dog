<template>
  <section class="py-32 bg-text text-white relative overflow-hidden">
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
    
    <div class="max-w-4xl mx-auto px-6 relative z-10 text-center">
      <span class="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-6 block">Newsletter</span>
      <h2 class="text-4xl md:text-6xl font-serif mb-8">{{ title }}</h2>
      <p class="text-slate-400 text-lg mb-12 font-light max-w-2xl mx-auto">{{ description }}</p>

      <form @submit.prevent="subscribe" class="flex flex-col md:flex-row gap-0 max-w-lg mx-auto border-b border-white/20 pb-2 focus-within:border-accent transition-colors duration-300">
        <input 
          type="email" 
          v-model="email"
          placeholder="votre@email.com" 
          class="flex-grow bg-transparent px-4 py-3 text-white placeholder-slate-500 focus:outline-none"
          required
        />
        <button 
          type="submit" 
          class="text-accent font-bold uppercase tracking-widest text-sm px-6 py-3 hover:text-white transition-colors"
        >
          {{ buttonText }}
        </button>
      </form>

      <p v-if="successMessage" class="mt-6 text-accent font-medium tracking-wide animate-fade-in">
        {{ successMessage }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Restez informé'
  },
  description: {
    type: String,
    default: 'Recevez nos actualités exclusives et invitations aux ventes privées.'
  },
  buttonText: {
    type: String,
    default: "S'INSCRIRE"
  }
})

const email = ref('');
const successMessage = ref('');

const subscribe = () => {
  // Simulate API call
  setTimeout(() => {
    successMessage.value = "VOUS ÊTES INSCRIT";
    email.value = '';
    setTimeout(() => successMessage.value = '', 5000);
  }, 500);
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
