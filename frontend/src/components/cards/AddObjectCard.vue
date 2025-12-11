<template>
  <router-link
    to="/particulier/vendre"
    class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-300 group cursor-pointer h-[456px]"
  > <!-- Hauteur ajustée pour matcher à peu près ObjectCard -->
    <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
      <i class="fa-solid fa-plus text-3xl text-gray-400 group-hover:text-accent transition-colors"></i>
    </div>
    <h3 class="text-xl font-bold text-gray-500 group-hover:text-accent transition-colors">Ajouter un objet</h3>
    <p class="text-sm text-gray-400 mt-2 text-center group-hover:text-accent/80">Commencer une nouvelle vente</p>
  </router-link>
</template>

<script setup>
</script>
