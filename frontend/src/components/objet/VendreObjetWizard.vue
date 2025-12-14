<template>
  <div class="w-full h-full bg-background flex flex-col items-center justify-start">
    <div class="w-full max-w-4xl relative">
      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-accent/10">

        <!-- Fermeture modal (Retour dashboard) -->
        <router-link
          :to="dashboardRoute"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg"
        >
          ✕
        </router-link>

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
import { reactive, ref, computed } from "vue";
import { useRouter } from 'vue-router';
import { objectService } from '../../services/objectService';
import { useAuthStore } from '../../stores/authStore';
import VendreObjetStep1 from "./steps/VendreObjetStep1.vue";
import VendreObjetStep2 from "./steps/VendreObjetStep2.vue";
import VendreObjetStep3 from "./steps/VendreObjetStep3.vue";

const router = useRouter();
const authStore = useAuthStore();
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

const dashboardRoute = computed(() => {
    return authStore.isPro ? '/pro/mes-objets' : '/particulier/mes-objets';
});

const submitForm = async () => {
    try {
        console.log("Objet publié :", form);
        
        // On s'assure que photos_urls est un tableau de strings
        // Note: Le backend attend photos_urls, documents_urls
        // Le form a 'photos' qui est probablement un tableau de File s'il y a upload, ou d'URLs
        // Pour l'instant on mocke les urls si ce sont des fichiers (car pas d'upload implémenté)
        
        const payload = {
            ...form,
            // Si photos contient des objets {file, preview}, on prend preview, sinon on met un placeholder
            photos_urls: form.photos.length 
                ? form.photos.map(p => p.preview || p) 
                : ['https://via.placeholder.com/400x300'],
            documents_urls: [], 
            // Mapping des champs si nécessaire
            vendeur_id: authStore.user?.userId || authStore.user?.id || 1
        };

        await objectService.createObject(payload);
        
        // Redirection vers la page mes objets correpondante
        router.push(dashboardRoute.value);
        
    } catch (error) {
        console.error("Erreur lors de la création de l'objet", error);
        alert("Une erreur est survenue lors de la création de l'objet.");
    }
};
</script>
