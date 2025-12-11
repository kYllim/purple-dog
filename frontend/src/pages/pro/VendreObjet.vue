<template>
  <div class="min-h-screen bg-background">
    <!-- Header Particulier -->
    <HeaderPublic />

    <!-- Bouton retour discret sous le logo -->
    <div class="max-w-2xl mx-auto px-4 mt-4">
      <router-link
        to="/dashboard/particulier"
        class="text-sm font-sans text-text/60 hover:text-accent transition-colors inline-block"
      >
        ← Retour au dashboard
      </router-link>
    </div>

    <!-- Wizard centré -->
    <div class="flex justify-center px-4 py-12">
      <div class="w-full max-w-2xl">
        <!-- Wizard -->
        <VendreObjetWizard />
      </div>
    </div>
  </div>
</template>

<script setup>
import VendreObjetWizard from "../../components/objet/VendreObjetWizard.vue";
import HeaderPublic from "../../components/HeaderPublic.vue";
</script>
