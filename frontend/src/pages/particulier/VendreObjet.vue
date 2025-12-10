<template>
  <div class="min-h-screen bg-background">
    <!-- Header Particulier -->
    <HeaderParticulier />

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
        <VendreObjetWizard
          :steps="steps"
          :current-step.sync="currentStep"
          :form.sync="form"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import VendreObjetWizard from "../../components/objet/VendreObjetWizard.vue";
import HeaderParticulier from "../../components/HeaderParticulier.vue";

const currentStep = ref(1);

const steps = [
  "Infos générales (1/3)",
  "Description (2/3)",
  "Prix et livraison (3/3)"
];

const form = reactive({
  titre: "",
  categorie_id: null,
  type: "",
  quantite: 1,
  photos: [],
  description: "",
  dimensions: { longueur: "", largeur: "", hauteur: "", unite: "cm" },
  poids_kg: "",
  type_vente: "",
  prix_souhaite: "",
  prix_depart: "",
  prix_achat_immediat: ""
});
</script>
