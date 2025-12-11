<template>
  <ProfessionnelLayout>

    <!-- HERO -->
    <section 
      class="relative py-28 text-center text-white flex items-center justify-center"
      :style="{ backgroundImage: `url('${heroBg}')`, backgroundSize: 'cover', backgroundPosition: 'center' }"
    >
      <div class="absolute inset-0 bg-black/50"></div>

      <div class="relative max-w-4xl mx-auto px-6">
        <h1 class="text-3xl md:text-6xl font-serif drop-shadow-2xl mb-6">
          Bonjour {{ userName }} 👋
        </h1>

        <p class="text-lg md:text-2xl font-light mb-12">
          Suivez votre activité professionnelle sur PurpleDog.
        </p>

        <button
          @click="showModal = true"
          class="mt-10 bg-accent hover:bg-[#b08d4d] text-white py-4 px-10 rounded-lg shadow-xl transition-all"
        >
          + Mettre un objet en vente
        </button>
      </div>
    </section>


    <!-- 🔍 BARRE DE RECHERCHE -->
    <section class="bg-background py-14 border-b border-text/10">
      <div class="max-w-6xl mx-auto px-6">

        <h2 class="text-2xl font-bold uppercase tracking-widest mb-6">Rechercher un objet</h2>

        <div class="bg-white p-6 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-4 gap-4">

          <!-- Recherche textuelle -->
          <input
            v-model="search.query"
            type="text"
            placeholder="Rechercher un objet..."
            class="border border-gray-300 rounded-xl px-4 py-3 focus:border-accent outline-none"
          />

          <!-- Catégorie -->
          <select v-model="search.category" class="border border-gray-300 rounded-xl px-4 py-3 focus:border-accent outline-none">
            <option value="">Toutes les catégories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>

          <!-- Type de vente -->
          <select v-model="search.type" class="border border-gray-300 rounded-xl px-4 py-3 focus:border-accent outline-none">
            <option value="">Tous les types</option>
            <option value="enchere">Enchères</option>
            <option value="rapide">Vente rapide</option>
          </select>

          <!-- Disponibilité -->
          <select v-model="search.status" class="border border-gray-300 rounded-xl px-4 py-3 focus:border-accent outline-none">
            <option value="">Disponibilité</option>
            <option value="en_vente">En vente</option>
            <option value="vendu">Vendu</option>
          </select>
        </div>
      </div>
    </section>


    <!-- 🛍️ OBJETS EN VENTE / LISTE MARCHÉ -->
    <section class="py-20 bg-background text-text">
      <div class="max-w-6xl mx-auto px-6">

        <h2 class="text-3xl font-bold uppercase tracking-widest mb-4">
          Objets disponibles
        </h2>

        <p class="text-gray-500 text-sm uppercase tracking-widest mb-12">
          Découvrez tous les objets en vente sur la plateforme.
        </p>

        <!-- Aucun objet -->
        <div v-if="filteredObjets.length === 0" class="p-12 bg-white rounded-3xl shadow text-center text-gray-500">
          Aucun objet ne correspond à votre recherche.
        </div>

        <!-- Liste d’objets -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          <ObjetCard
            v-for="obj in filteredObjets"
            :key="obj.id"
            :image="obj.image"
            :title="obj.titre"
            :description="obj.description"
            :status="obj.status"
            :type="obj.type_vente"
            :info-label="obj.type_vente === 'Enchères' ? 'Enchère actuelle' : 'Prix'"
            :info-value="obj.prix_souhaite + ' €'"
            :time="obj.type_vente === 'Enchères' ? obj.time : null"
            :action="obj.type_vente === 'Enchères' ? 'Placer une enchère' : 'Acheter'"
            :favorite="obj.favorite"
            @toggle-favorite="toggleFavorite(obj.id)"
            @action="voirObjet(obj.id)"
            />


        </div>
      </div>
    </section>


    <!-- 🧩 MODAL WIZARD (Mettre en vente) -->
    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        
        <button @click="showModal = false" class="absolute top-8 right-8 text-white text-2xl font-bold hover:text-accent">
          ✕
        </button>

        <div class="relative w-full max-w-3xl bg-white rounded-2xl p-6 shadow-xl">

          <!-- Barre progression -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <span
                v-for="(step, index) in steps"
                :key="index"
                :class="currentStep > index ? 'text-accent' : 'text-text/30'"
              >
                Étape {{ index + 1 }}
              </span>
            </div>

            <div class="w-full bg-text/10 rounded-full h-2">
              <div class="bg-accent h-2 rounded-full transition-all" :style="{ width: `${(currentStep / steps.length) * 100}%` }"></div>
            </div>
          </div>

          <!-- Séquence du Wizard -->
          <VendreObjetStep1 v-if="currentStep === 1" :model-value="form" @update:modelValue="v => Object.assign(form, v)" @next="goNext" />
          <VendreObjetStep2 v-if="currentStep === 2" :model-value="form" @update:modelValue="v => Object.assign(form, v)" @back="goBack" @next="goNext" />
          <VendreObjetStep3 v-if="currentStep === 3" :model-value="form" @update:modelValue="v => Object.assign(form, v)" @back="goBack" @submit="submitForm" />

        </div>
      </div>
    </transition>

  </ProfessionnelLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import ProfessionnelLayout from "../../layouts/ProfessionnelLayout.vue";
import VendreObjetStep1 from "../../components/objet/steps/VendreObjetStep1.vue";
import VendreObjetStep2 from "../../components/objet/steps/VendreObjetStep2.vue";
import VendreObjetStep3 from "../../components/objet/steps/VendreObjetStep3.vue";
import ObjetCard from "../../components/cards/ObjetCard.vue";

const heroBg = "/src/assets/img/illustration.jpg";
const userName = "Professionnel";

const showModal = ref(false);
const currentStep = ref(1);
const steps = ["Infos générales", "Description", "Prix & vente"];

const form = reactive({ titre: "", categorie_id: null, prix_souhaite: "", type_vente: "", photos: [] });

const goNext = () => currentStep.value++;
const goBack = () => currentStep.value--;
const submitForm = () => { showModal.value = false; };

const search = reactive({ query: "", category: "", type: "", status: "" });

const categories = [
  { id: 1, name: "Peinture" },
  { id: 2, name: "Sculpture" },
  { id: 3, name: "Montre" }
];

const objets = ref([]);

onMounted(() => {
  objets.value = [
    {
      id: 1,
      titre: "Montre Rolex Submariner 2020",
      categorie: "Montre",
      prix_souhaite: 15000,
      type_vente: "Enchères",
      image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg",
      description: "Montre iconique en excellent état, modèle 2020.",
      status: "En vente",
      time: "2 j 14 h",
      favorite: false
    },
    {
      id: 2,
      titre: "Tableau contemporain abstrait",
      categorie: "Peinture",
      prix_souhaite: 2300,
      type_vente: "Vente rapide",
      image: "https://images.pexels.com/photos/269320/pexels-photo-269320.jpeg",
      description: "Peinture moderne aux couleurs vives.",
      status: "En vente",
      time: null,
      favorite: true
    },
    {
      id: 3,
      titre: "Sculpture Bronze 1980",
      categorie: "Sculpture",
      prix_souhaite: 4700,
      type_vente: "Enchères",
      image: "https://images.pexels.com/photos/652700/pexels-photo-652700.jpeg",
      description: "Sculpture signée, pièce rare, 1980.",
      status: "En vente",
      time: "5 j 2 h",
      favorite: false
    },
    {
      id: 4,
      titre: "Vase ancien Dynastie Qing",
      categorie: "Art asiatique",
      prix_souhaite: 12000,
      type_vente: "Vente rapide",
      image: "https://images.pexels.com/photos/330987/pexels-photo-330987.jpeg",
      description: "Vase historique en porcelaine, état impeccable.",
      status: "Plus disponible",
      time: null,
      favorite: false
    },
    {
      id: 5,
      titre: "Lithographie Picasso",
      categorie: "Art",
      prix_souhaite: 89000,
      type_vente: "Enchères",
      image: "https://images.pexels.com/photos/208188/pexels-photo-208188.jpeg",
      description: "Œuvre authentifiée, tirage limité.",
      status: "En vente",
      time: "12 h",
      favorite: true
    },
    {
      id: 6,
      titre: "Montre Patek Philippe 1953",
      categorie: "Montre",
      prix_souhaite: 125000,
      type_vente: "Enchères",
      image: "https://images.pexels.com/photos/280253/pexels-photo-280253.jpeg",
      description: "Montre vintage exceptionnelle.",
      status: "En vente",
      time: "7 j",
      favorite: false
    }
  ];
});


const filteredObjets = computed(() => {
  return objets.value.filter(obj => {

    return (
      (search.query === "" || obj.titre.toLowerCase().includes(search.query.toLowerCase())) &&
      (search.category === "" || obj.categorie_id == search.category) &&
      (search.type === "" || obj.type_vente.toLowerCase().includes(search.type.toLowerCase()))
    );
  });
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
