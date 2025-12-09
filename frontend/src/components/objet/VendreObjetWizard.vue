<template>
  <div class="min-h-screen bg-gray-50">

    <div class="max-w-4xl mx-auto px-4 py-10">

      <!-- Wizard Header -->
      <div class="flex items-center justify-between mb-10 border-b pb-4">
        <div
          v-for="(stepLabel, index) in steps"
          :key="index"
          class="flex-1 text-center cursor-pointer"
          @click="goToStep(index)"
        >
          <div
            class="font-semibold text-lg"
            :class="currentStep === index ? 'text-black' : 'text-gray-400'"
          >
            {{ stepLabel }}
          </div>

          <div class="h-1 mt-2"
               :class="currentStep === index ? 'bg-black' : 'bg-gray-200'">
          </div>
        </div>
      </div>

      <!-- Étapes -->
      <div>
        <VendreObjetStep1
          v-if="currentStep === 0"
          v-model="form"
          @next="goToStep(1)"
        />

        <VendreObjetStep2
          v-if="currentStep === 1"
          v-model="form"
          @next="goToStep(2)"
          @back="goToStep(0)"
        />

        <VendreObjetStep3
          v-if="currentStep === 2"
          v-model="form"
          @back="goToStep(1)"
          @submit="submitForm"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

import VendreObjetStep1 from "./steps/VendreObjetStep1.vue";
import VendreObjetStep2 from "./steps/VendreObjetStep2.vue";
import VendreObjetStep3 from "./steps/VendreObjetStep3.vue";

const steps = [
  "Infos générales (1/3)",
  "Description (2/3)",
  "Prix et livraison (3/3)"
];

const currentStep = ref(0);

const goToStep = (step) => {
  currentStep.value = step;
};

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

const submitForm = () => {
  console.log("Soumission finale :", form);
  alert("Objet publié !");
};
</script>
