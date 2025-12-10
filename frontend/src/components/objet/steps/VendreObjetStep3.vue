<template>
  <div class="space-y-8">

    <!-- TYPE DE VENTE -->
    <div>
      <label class="block font-sans text-text mb-3">Type de vente *</label>

      <div class="space-y-3">
        <label class="flex items-center gap-3 cursor-pointer font-sans text-text">
          <input
            type="radio"
            value="INSTANTANE"
            v-model="localForm.type_vente"
            class="accent-accent"
          />
          <span>Vente instantanée (prix fixe)</span>
        </label>

        <label class="flex items-center gap-3 cursor-pointer font-sans text-text">
          <input
            type="radio"
            value="ENCHERE"
            v-model="localForm.type_vente"
            class="accent-accent"
          />
          <span>Enchères (prix de départ)</span>
        </label>
      </div>
    </div>

    <!-- PRIX -->
    <div>
      <label class="block font-sans text-text mb-2">Prix souhaité *</label>
      <input
        type="number"
        v-model="localForm.prix_souhaite"
        class="w-full border rounded-lg px-4 py-3 font-sans text-text focus:ring-accent focus:border-accent"
        placeholder="Prix du produit"
      />

      <!-- Si ENCHERE -->
      <div v-if="localForm.type_vente === 'ENCHERE'" class="mt-4">
        <label class="block font-sans text-text mb-2">
          Prix de départ (-10%)
        </label>
        <input
          type="number"
          class="w-full border rounded-lg px-4 py-3 bg-gray-100 font-sans text-text focus:ring-accent focus:border-accent"
          :value="prixDepart"
          disabled
        />
      </div>

      <!-- Si INSTANTANÉ -->
      <div v-if="localForm.type_vente === 'INSTANTANE'" class="mt-4">
        <label class="block font-sans text-text mb-2">
          Prix de vente rapide *
        </label>
        <input
          type="number"
          v-model="localForm.prix_achat_immediat"
          class="w-full border rounded-lg px-4 py-3 font-sans text-text focus:ring-accent focus:border-accent"
        />
      </div>
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
        @click="$emit('submit')"
      >
        Publier l’objet →
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue";

const props = defineProps({
  modelValue: Object,
});
const emit = defineEmits(["update:modelValue", "back", "submit"]);

const localForm = reactive(JSON.parse(JSON.stringify(props.modelValue)));

watch(localForm, () => {
  emit("update:modelValue", localForm);
}, { deep: true });

const prixDepart = computed(() =>
  localForm.prix_souhaite ? Math.round(localForm.prix_souhaite * 0.9) : 0
);
</script>
