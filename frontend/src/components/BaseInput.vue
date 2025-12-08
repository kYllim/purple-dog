<template>
  <div class="relative w-full group">
    <label v-if="label" :for="uid" class="block text-sm font-medium text-[#0F172A]/70 mb-1 group-focus-within:text-[#C5A059]">
      {{ label }} <span v-if="requis" class="text-red-400">*</span>
    </label>
    <div class="relative">
      <input
        :id="uid"
        :type="typeCalc"
        :value="modelValue"
        :placeholder="placeholder"
        :required="requis"
        :disabled="desactive"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        class="w-full px-4 py-2 bg-white text-[#0F172A] border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] font-sans"
        :class="{'border-red-500': erreur}"
      />
      <button v-if="type === 'password'" type="button" @click="visible = !visible" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C5A059]">
        <span v-if="visible">👁️</span>
        <span v-else>👁️‍🗨️</span>
      </button>
    </div>
    <p v-if="erreur" class="text-xs text-red-500 mt-1 ml-1">{{ erreur }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  requis: Boolean,
  desactive: Boolean,
  erreur: String
})

defineEmits(['update:modelValue', 'blur'])

const uid = 'i-' + Math.random().toString(36).substr(2, 9)
const visible = ref(false)
const typeCalc = computed(() => (props.type === 'password' && visible.value ? 'text' : props.type))
</script>
