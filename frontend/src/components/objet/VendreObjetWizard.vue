<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4 py-12">
    <div class="w-full max-w-2xl relative">
      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-accent/10">

        <!-- Fermeture modal -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg"
        >
          ✕
        </button>

        <!-- Header -->
        <div class="text-center mb-6">
          <h1 class="text-3xl font-serif text-text">{{ title }}</h1>
          <p v-if="subtitle" class="mt-2 text-sm text-text/60 font-sans">{{ subtitle }}</p>
        </div>

        <!-- Barre de progression des étapes -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-2">
            <span
              v-for="(stepLabel, index) in steps"
              :key="index"
              class="text-sm font-medium font-sans"
              :class="currentStep > index ? 'text-accent' : 'text-text/30'"
            >
              Étape {{ index + 1 }}
            </span>
          </div>
          <div class="w-full bg-text/10 rounded-full h-2">
            <div
              class="bg-accent h-2 rounded-full transition-all duration-300"
              :style="{ width: `${((currentStep) / steps.length) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Wizard Steps -->
        <div class="space-y-6">
          <VendreObjetStep1
            v-if="currentStep === 1"
            :model-value="form"
            @update:modelValue="val => Object.assign(form, val)"
            @next="goNext"
          />

          <VendreObjetStep2
            v-if="currentStep === 2"
            :model-value="form"
            @update:modelValue="val => Object.assign(form, val)"
            @back="goBack"
            @next="goNext"
          />

          <VendreObjetStep3
            v-if="currentStep === 3"
            :model-value="form"
            @update:modelValue="val => Object.assign(form, val)"
            @back="goBack"
            @submit="submitForm"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from 'vue-router';
import VendreObjetStep1 from "./steps/VendreObjetStep1.vue";
import VendreObjetStep2 from "./steps/VendreObjetStep2.vue";
import VendreObjetStep3 from "./steps/VendreObjetStep3.vue";

const router = useRouter();
const currentStep = ref(1);
const title = "Création d'une vente";
const subtitle = "Publiez votre objet en toute simplicité";

const steps = ["Infos générales", "Description", "Prix et livraison"];

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

const goNext = () => {
  if (currentStep.value < 3) currentStep.value++;
};
const goBack = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const submitForm = () => {
  console.log("Objet publié :", form);
  alert("Objet publié !");
};
</script>
