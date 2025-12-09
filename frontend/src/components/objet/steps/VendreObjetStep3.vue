<template>
  <div class="space-y-8">

    <!-- TYPE DE VENTE -->
    <div>
      <label class="block font-medium text-gray-800 mb-3">Type de vente *</label>

      <div class="space-y-3">
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            value="INSTANTANE"
            v-model="localForm.type_vente"
          />
          <span>Vente instantanée (prix fixe)</span>
        </label>

        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            value="ENCHERE"
            v-model="localForm.type_vente"
          />
          <span>Enchères (prix de départ)</span>
        </label>
      </div>
    </div>

    <!-- PRIX -->
    <div>
      <label class="block font-medium text-gray-800 mb-2">Prix souhaité *</label>
      <input
        type="number"
        v-model="localForm.prix_souhaite"
        class="w-full border rounded-lg px-4 py-3"
        placeholder="Prix du produit"
      />

      <!-- Si ENCHERE -->
      <div v-if="localForm.type_vente === 'ENCHERE'" class="mt-4">
        <label class="block font-medium text-gray-800 mb-2">
          Prix de départ (-10%)
        </label>
        <input
          type="number"
          class="w-full border rounded-lg px-4 py-3 bg-gray-100"
          :value="prixDepart"
          disabled
        />
      </div>

      <!-- Si INSTANTANÉ -->
      <div v-if="localForm.type_vente === 'INSTANTANE'" class="mt-4">
        <label class="block font-medium text-gray-800 mb-2">
          Prix de vente rapide *
        </label>
        <input
          type="number"
          v-model="localForm.prix_achat_immediat"
          class="w-full border rounded-lg px-4 py-3"
        />
      </div>
    </div>

    <!-- CTA -->
    <div class="flex justify-between mt-8">
      <button
        class="px-6 py-3 bg-gray-200 rounded-lg"
        @click="$emit('back')"
      >
        ← Retour
      </button>

      <button
        class="px-6 py-3 bg-black text-white rounded-lg"
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
