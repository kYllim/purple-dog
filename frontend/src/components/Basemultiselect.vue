<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Selected items (tags) -->
    <div v-if="selectedItems.length > 0" class="flex flex-wrap gap-2 mb-3">
      <span
        v-for="item in selectedItems"
        :key="item.value"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
      >
        {{ item.label }}
        <button
          type="button"
          @click="removeItem(item.value)"
          class="hover:bg-purple-200 rounded-full p-0.5 transition-colors duration-200"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
    </div>

    <!-- Options grid -->
    <div :class="gridClasses">
      <label
        v-for="option in options"
        :key="option.value"
        class="relative flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-purple-300 transition-all duration-200"
        :class="{ 'bg-purple-50 border-purple-400': isSelected(option.value) }"
      >
        <div class="flex items-center h-6">
          <input
            type="checkbox"
            :name="name"
            :value="option.value"
            :checked="isSelected(option.value)"
            @change="toggleOption(option)"
            class="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
          />
        </div>
        <div class="ml-3 flex-1">
          <span class="block text-sm font-medium text-gray-900">
            {{ option.label }}
          </span>
          <span v-if="option.description" class="block text-xs text-gray-500 mt-0.5">
            {{ option.description }}
          </span>
        </div>
      </label>
    </div>

    <!-- Hint text -->
    <p v-if="hint && !error" class="mt-2 text-sm text-gray-500">
      {{ hint }}
    </p>

    <!-- Error message -->
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  hint: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  columns: {
    type: Number,
    default: 2
  }
});

const emit = defineEmits(['update:modelValue']);

const selectedItems = computed(() => {
  return props.options.filter(opt => props.modelValue.includes(opt.value));
});

const gridClasses = computed(() => {
  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };
  return `grid gap-3 ${cols[props.columns] || cols[2]}`;
});

const isSelected = (value) => {
  return props.modelValue.includes(value);
};

const toggleOption = (option) => {
  const newValue = [...props.modelValue];
  const index = newValue.indexOf(option.value);

  if (index > -1) {
    newValue.splice(index, 1);
  } else {
    newValue.push(option.value);
  }

  emit('update:modelValue', newValue);
};

const removeItem = (value) => {
  const newValue = props.modelValue.filter(v => v !== value);
  emit('update:modelValue', newValue);
};
</script>