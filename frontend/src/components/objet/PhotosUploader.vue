<template>
  <div>
    <input type="file" multiple @change="handleFiles" />
    <div class="mt-2 flex flex-wrap gap-2">
      <img v-for="(url, i) in modelValue" :key="i" :src="url" class="w-20 h-20 object-cover rounded" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: false }
});

const emit = defineEmits(["update:modelValue"]);

const handleFiles = (e) => {
  const files = e.target.files;
  const urls = Array.from(files).map(file => URL.createObjectURL(file));
  emit("update:modelValue", props.multiple ? [...props.modelValue, ...urls] : urls);
};
</script>
