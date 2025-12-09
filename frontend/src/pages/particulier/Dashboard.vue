<template>
  <Navbar />

  <div class="min-h-screen bg-background px-4 py-10">
    <div class="max-w-5xl mx-auto">

      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-text">Dashboard Particulier</h1>
        <p class="text-gray-600 mt-2">
          Gérez facilement vos ventes, votre profil et vos interactions.
        </p>
      </div>

      <!-- Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

        <!-- Vendre un objet -->
        <RouterLink
          to="/particulier/vendre"
          class="group bg-white rounded-xl p-6 shadow hover:shadow-lg transition relative"
        >
          <div class="flex items-center gap-4">
            <div class="bg-accent/10 text-accent p-3 rounded-lg text-xl group-hover:scale-110 transition">
              📦
            </div>
            <div>
              <h3 class="text-lg font-semibold text-text">Vendre un objet</h3>
              <p class="text-sm text-gray-600 mt-1">
                Publiez un objet rapidement et facilement.
              </p>
            </div>
          </div>

          <div class="mt-4 text-accent font-medium group-hover:underline">Commencer →</div>
        </RouterLink>

        <!-- Mes objets -->
        <RouterLink
          to="/dashboard/particulier/mes-objets"
          class="group bg-white rounded-xl p-6 shadow hover:shadow-lg transition relative"
        >
          <div class="flex items-center gap-4">
            <div class="bg-accent/10 text-accent p-3 rounded-lg text-xl group-hover:scale-110 transition">
              📁
            </div>
            <div>
              <h3 class="text-lg font-semibold text-text">Mes objets</h3>
              <p class="text-sm text-gray-600 mt-1">
                Consultez vos objets en vente et offres reçues.
              </p>
            </div>
          </div>

          <div class="mt-4 text-accent font-medium group-hover:underline">Voir mes objets →</div>
        </RouterLink>

        <!-- Profil -->
        <RouterLink
          to="/dashboard/particulier/profil"
          class="group bg-white rounded-xl p-6 shadow hover:shadow-lg transition relative"
        >
          <div class="flex items-center gap-4">
            <div class="bg-accent/10 text-accent p-3 rounded-lg text-xl group-hover:scale-110 transition">
              👤
            </div>
            <div>
              <h3 class="text-lg font-semibold text-text">Mon profil</h3>
              <p class="text-sm text-gray-600 mt-1">
                Mettez à jour vos informations personnelles.
              </p>
            </div>
          </div>

          <div class="mt-4 text-accent font-medium group-hover:underline">Modifier le profil →</div>
        </RouterLink>

        <!-- Avis -->
        <RouterLink
          to="/dashboard/particulier/avis"
          class="group bg-white rounded-xl p-6 shadow hover:shadow-lg transition relative"
        >
          <div class="flex items-center gap-4">
            <div class="bg-accent/10 text-accent p-3 rounded-lg text-xl group-hover:scale-110 transition">
              ⭐
            </div>
            <div>
              <h3 class="text-lg font-semibold text-text">Donner un avis</h3>
              <p class="text-sm text-gray-600 mt-1">
                Aidez-nous à améliorer la plateforme.
              </p>
            </div>
          </div>

          <div class="mt-4 text-accent font-medium group-hover:underline">Donner mon avis →</div>
        </RouterLink>

      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "../../components/layout/NavBar.vue";
</script>
