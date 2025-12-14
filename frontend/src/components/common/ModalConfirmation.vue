<template>
  <div v-if="isOpen" class="fixed inset-0 z-[999] flex items-center justify-center p-4">

    <div @click="close" class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
    

    <div class="bg-white rounded-lg shadow-2xl relative w-full max-w-md transform transition-all border border-gray-100 overflow-hidden">
        

        <div class="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-accent/20">
            <h3 class="text-accent font-serif font-bold tracking-wider text-lg">{{ title }}</h3>
            <button @click="close" class="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>


        <div class="p-6">
            <p class="text-gray-600 text-sm leading-relaxed">
                <slot></slot>
            </p>
        </div>


        <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
            <button 
                @click="close"
                class="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800 uppercase tracking-wide transition-colors"
                :disabled="isLoading"
            >
                Annuler
            </button>
            <button 
                @click="confirm"
                class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-widest rounded-sm shadow-md transition-colors flex items-center gap-2"
                :class="{'opacity-50 cursor-not-allowed': isLoading}"
                :disabled="isLoading"
            >
                <div v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span v-else>Confirmer</span>
            </button>
        </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
    isOpen: Boolean,
    title: { type: String, default: 'Confirmation' },
    isLoading: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'confirm']);

const close = () => {
    emit('close');
};

const confirm = () => {
    emit('confirm');
};
</script>
