<template>
  
  <div class="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-800">
    
    <!-- En-tête -->
    <div class="mb-8">
      <h1 class="text-3xl font-serif font-bold text-[#0F172A]">Tableau de Bord Admin</h1>
      <p class="text-slate-500 mt-1">Gérez votre plateforme.</p>
    </div>

    <!-- Contenu: Vue d'ensemble (Stats Fake) -->
    <div class="animate-fade-in-up">
       <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <!-- Carte Stats Simple -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
            <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">U</div>
            <div class="ml-4">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Utilisateurs</p>
              <p class="text-2xl font-bold text-slate-800">1,245</p>
            </div>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
            <div class="w-12 h-12 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center text-xl font-bold">€</div>
            <div class="ml-4">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenus</p>
              <p class="text-2xl font-bold text-slate-800">12,450€</p>
            </div>
          </div>
       </div>

       <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h2 class="text-lg font-bold text-slate-700 mb-4">Activité Récente</h2>
           <p class="text-slate-500 italic">Aucune activité récente.</p>
       </div>
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
