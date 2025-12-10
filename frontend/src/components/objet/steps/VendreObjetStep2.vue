<template>
  <div class="space-y-8">

    <!-- DESCRIPTION -->
    <div>
      <label class="block font-sans text-text mb-2">
        Description détaillée *
      </label>

      <textarea
        v-model="localForm.description"
        rows="6"
        class="w-full border rounded-lg px-4 py-3 text-text font-sans focus:ring-accent focus:border-accent"
        placeholder="Décrivez votre objet, sa matière, son état, son histoire..."
      ></textarea>
    </div>

    <!-- DIMENSIONS -->
    <div>
      <label class="block font-sans text-text mb-3">Dimensions *</label>

      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <input
            v-model="localForm.dimensions.longueur"
            type="number"
            placeholder="Longueur"
            class="w-full border rounded-lg px-4 py-3 text-text font-sans focus:ring-accent focus:border-accent"
          />
        </div>

        <div>
          <input
            v-model="localForm.dimensions.largeur"
            type="number"
            placeholder="Largeur"
            class="w-full border rounded-lg px-4 py-3 text-text font-sans focus:ring-accent focus:border-accent"
          />
        </div>

        <div>
          <input
            v-model="localForm.dimensions.hauteur"
            type="number"
            placeholder="Hauteur"
            class="w-full border rounded-lg px-4 py-3 text-text font-sans focus:ring-accent focus:border-accent"
          />
        </div>

        <div>
          <select
            v-model="localForm.dimensions.unite"
            class="w-full border rounded-lg px-4 py-3 text-text font-sans focus:ring-accent focus:border-accent"
          >
            <option value="cm">cm</option>
            <option value="mm">mm</option>
            <option value="m">m</option>
          </select>
        </div>
      </div>
    </div>

    <!-- POIDS -->
    <div>
      <label class="block font-sans text-text mb-2">Poids *</label>

      <input
        type="number"
        v-model="localForm.poids_kg"
        placeholder="Poids en kilogrammes"
        class="w-full border rounded-lg px-4 py-3 text-text font-sans focus:ring-accent focus:border-accent"
      />
    </div>

    <!-- CTA -->
    <div class="flex justify-between mt-8">
      <button
        class="px-6 py-3 bg-gray-200 rounded-lg font-sans text-text hover:bg-gray-300 transition-all"
        @click="$emit('back')"
      >
        ← Retour
      </button>

      <button
        class="px-6 py-3 bg-accent text-white font-sans uppercase tracking-widest py-4 px-10 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
        @click="$emit('next')"
      >
        Passer à l’étape 3/3 →
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  modelValue: Object,
});
const emit = defineEmits(["update:modelValue", "next", "back"]);

const localForm = reactive(JSON.parse(JSON.stringify(props.modelValue)));

watch(localForm, () => {
  emit("update:modelValue", localForm);
}, { deep: true });
</script>
