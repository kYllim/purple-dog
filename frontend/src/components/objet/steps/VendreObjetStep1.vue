<template>
  <div class="space-y-8">

    <!-- NOM DU PRODUIT -->
    <div>
      <label class="block font-sans text-text mb-2">Nom du produit *</label>
      <input
        v-model="localForm.titre"
        type="text"
        maxlength="75"
        class="w-full border rounded-lg px-4 py-3 text-text font-sans focus:ring-accent focus:border-accent"
        placeholder="Ex : Montre Omega vintage"
      />
      <p class="text-right text-xs text-text/50 font-sans">{{ localForm.titre.length }}/75</p>
    </div>

    <!-- Catégorie -->
    <div>
      <label class="block font-sans text-text mb-2">Catégorie *</label>
      <select
        v-model="localForm.categorie_id"
        class="w-full border rounded-lg px-4 py-3 text-text font-sans focus:ring-accent focus:border-accent"
      >
        <option disabled value="">Renseigner une catégorie</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.nom }}
        </option>
      </select>
    </div>

    <!-- Quantité -->
    <div>
      <label class="block font-sans text-text mb-2">Quantité *</label>
      <select
        v-model="localForm.quantite"
        class="w-full border rounded-lg px-4 py-3 text-text font-sans focus:ring-accent focus:border-accent"
      >
        <option disabled value="">Sélectionner une quantité</option>
        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>

    <!-- Photos -->
    <div>
      <label class="block font-sans text-text mb-4">
        Photos du produit (min. 2)
      </label>

      <div class="grid grid-cols-3 sm:grid-cols-5 gap-4">
        <!-- Ajouter -->
        <label
          class="border-2 border-dashed rounded-lg h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 font-sans text-text"
        >
          <span class="text-3xl">+</span>
          <span class="text-sm">Ajouter</span>
          <input type="file" class="hidden" multiple @change="addPhotos" />
        </label>

        <!-- Thumbnails générées -->
        <div
          v-for="(photo, index) in localForm.photos"
          :key="index"
          class="h-28 border rounded-lg bg-gray-100 overflow-hidden"
        >
          <img :src="photo.preview" class="h-full w-full object-cover" />
        </div>
      </div>
    </div>

    <!-- CTA -->
    <button
      class="w-full bg-accent text-white font-sans uppercase tracking-widest py-4 px-10 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all mt-6"
      @click="$emit('next')"
    >
      Passer à l’étape 2/3 →
    </button>

  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  modelValue: Object
});
const emit = defineEmits(["update:modelValue", "next"]);

const localForm = reactive(JSON.parse(JSON.stringify(props.modelValue)));

watch(localForm, () => {
  emit("update:modelValue", localForm);
}, { deep: true });

const categories = [
  { id: 1, nom: "Bijoux & montres" },
  { id: 2, nom: "Meubles anciens" },
  { id: 3, nom: "Objets d’art" },
  { id: 4, nom: "Peintures & sculptures" },
  { id: 5, nom: "Accessoires de luxe" }
];

const addPhotos = (e) => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    localForm.photos.push({
      file,
      preview: URL.createObjectURL(file)
    });
  });
};
</script>
