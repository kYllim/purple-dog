<template>
  <PublicLayout>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fa-solid fa-ban text-4xl text-gray-500"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Paiement Annulé</h1>
        <p class="text-gray-600 mb-8">
            Vous n'avez pas été débité. Vous pouvez réessayer à tout moment.
        </p>
        
        <button @click="$router.go(-1)" class="block w-full py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-black transition-colors">
            Retour à l'objet
        </button>

      </div>
    </div>
  </PublicLayout>
</template>
<script setup>
import PublicLayout from '../layouts/PublicLayout.vue';
</script>
