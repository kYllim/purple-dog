<template>
  <PublicLayout>


<!-- 🎨 HERO -->
<section 
  class="relative py-28 text-center text-white flex items-center justify-center"
  :style="{
    backgroundImage: `url('${heroBg}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }"
>
  <div class="absolute inset-0 bg-black/50"></div>

  <div class="relative max-w-4xl mx-auto px-6">
    <h1 class="text-3xl md:text-6xl font-serif text-white mb-6 drop-shadow-2xl tracking-wide">
      Bonjour {{ userName }} 👋
    </h1>

    <p class="text-lg md:text-2xl text-gray-200 font-light tracking-widest uppercase mb-12">
      Gérez vos objets, suivez vos ventes et publiez de nouvelles annonces.
    </p>

    <!-- Bouton qui ouvre le modal -->
    <button
      @click="showModal = true"
      class="mt-10 inline-block bg-accent hover:bg-[#b08d4d] text-white text-sm font-bold uppercase tracking-widest py-4 px-10 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
    >
      + Créer une vente
    </button>
  </div>
</section>

<!-- MODAL FLOTTANT AVEC WIZARD INTÉGRÉ -->
<transition name="fade">
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
  >
    <!-- Fermeture flottante -->
    <button
      class="absolute top-8 right-8 text-white text-2xl font-bold hover:text-accent z-50"
      @click="showModal = false"
    >
      ✕
    </button>

    <!-- Contenu du Wizard directement dans le modal -->
    <div class="relative w-full max-w-3xl">

      <!-- Header du Wizard -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-serif text-text">{{ wizardTitle }}</h1>
        <p v-if="wizardSubtitle" class="mt-2 text-sm text-text/60 font-sans">{{ wizardSubtitle }}</p>
      </div>

      <!-- Barre de progression -->
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
            :style="{ width: `${(currentStep / steps.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Étapes du Wizard -->
      <transition name="fade">
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
  >
    <!-- Bouton de fermeture -->
    <button
      class="absolute top-8 right-8 text-white text-2xl font-bold hover:text-accent z-50"
      @click="showModal = false"
    >
      ✕
    </button>

<transition name="fade">
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
  >
    <!-- Bouton de fermeture -->
    <button
      class="absolute top-8 right-8 text-white text-2xl font-bold hover:text-accent z-50"
      @click="showModal = false"
    >
      ✕
    </button>


<!-- Wizard avec fond blanc pour lisibilité -->
<div class="relative w-full max-w-3xl bg-white rounded-2xl p-6 shadow-xl">
  <!-- Barre de progression -->
  <div class="mb-6">
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
        :style="{ width: `${(currentStep / steps.length) * 100}%` }"
      ></div>
    </div>
  </div>

  <!-- Wizard Steps -->
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
```

  </div>
</transition>

```

  </div>
</transition>


    </div>
  </div>
</transition>

<!-- 🌟 MES OBJETS -->
<section class="py-20 bg-background text-text">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl font-bold uppercase tracking-widest mb-4">
      Vos objets en vente
    </h2>

    <p class="text-gray-500 text-sm uppercase tracking-widest mb-12">
      Retrouvez ici tous les objets que vous avez publiés.
    </p>

    <div
      v-if="mesObjets.length === 0"
      class="p-12 bg-white rounded-3xl shadow text-center text-gray-500"
    >
      Vous n’avez pas encore mis d’objet en vente.
    </div>
  </div>
</section>
```

  </PublicLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import PublicLayout from "../../layouts/PublicLayout.vue";
import VendreObjetStep1 from "../../components/objet/steps/VendreObjetStep1.vue";
import VendreObjetStep2 from "../../components/objet/steps/VendreObjetStep2.vue";
import VendreObjetStep3 from "../../components/objet/steps/VendreObjetStep3.vue";

const heroBg = "/src/assets/img/illustration.jpg";
const userName = "Utilisateur";
const mesObjets = ref([]);
const showModal = ref(false);
const currentStep = ref(1);

const wizardTitle = "Création d'une vente";
const wizardSubtitle = "Publiez votre objet en toute simplicité";

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
  showModal.value = false; // fermeture automatique
};

onMounted(() => {
  mesObjets.value = [];
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
