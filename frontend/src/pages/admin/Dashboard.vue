<template>
<<<<<<< HEAD
  
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
=======
  <div>
    <h2 class="mb-6 text-3xl font-extrabold text-slate-800">Tableau de bord</h2>

    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <div class="flex items-center">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-slate-500">Utilisateurs Totaux</h3>
            <p class="text-2xl font-bold text-slate-800">1,245</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <div class="flex items-center">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-accent bg-opacity-20 text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-slate-500">Enchères Actives</h3>
            <p class="text-2xl font-bold text-slate-800">84</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <div class="flex items-center">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-slate-500">Revenu (Mois)</h3>
            <p class="text-2xl font-bold text-slate-800">12,450€</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <div class="flex items-center">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-slate-500">Alertes</h3>
            <p class="text-2xl font-bold text-slate-800">3</p>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-xl bg-white shadow-sm border border-slate-100">
        <div class="border-b border-slate-100 px-6 py-4">
            <h3 class="text-lg font-bold text-slate-800">Activité Récente</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-600">
                <thead class="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                        <th class="px-6 py-3 font-semibold">Utilisateur</th>
                        <th class="px-6 py-3 font-semibold">Action</th>
                        <th class="px-6 py-3 font-semibold">Date</th>
                        <th class="px-6 py-3 font-semibold">Statut</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4 font-medium text-slate-900">Jean Dupont</td>
                        <td class="px-6 py-4">Nouvelle enchère sur "Vase Ming"</td>
                        <td class="px-6 py-4">Il y a 2 minutes</td>
                         <td class="px-6 py-4">
                             <span class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                Succès
                             </span>
                        </td>
                    </tr>
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4 font-medium text-slate-900">Marie Curie</td>
                        <td class="px-6 py-4">Inscription nouvel utilisateur</td>
                        <td class="px-6 py-4">Il y a 15 minutes</td>
                        <td class="px-6 py-4">
                            <span class="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                                Nouveau
                            </span>
                        </td>
                    </tr>
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4 font-medium text-slate-900">Paul Martin</td>
                        <td class="px-6 py-4">Paiement échoué</td>
                        <td class="px-6 py-4">Il y a 1 heure</td>
                        <td class="px-6 py-4">
                            <span class="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                                Erreur
                            </span>
                        </td>
                    </tr>
                     <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4 font-medium text-slate-900">Sophie L.</td>
                        <td class="px-6 py-4">Mise à jour du profil</td>
                        <td class="px-6 py-4">Il y a 3 heures</td>
                        <td class="px-6 py-4">
                             <span class="inline-flex rounded-full bg-slate-100 px-2 text-xs font-semibold leading-5 text-slate-800">
                                Info
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
         <div class="border-t border-slate-100 px-6 py-4 text-center">
            <a href="#" class="text-sm font-medium text-accent hover:text-yellow-600">Voir toute l'activité &rarr;</a>
        </div>
>>>>>>> particulier
    </div>

  </div>
</template>
<<<<<<< HEAD

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
=======
>>>>>>> particulier
