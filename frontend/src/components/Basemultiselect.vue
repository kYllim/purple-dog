<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-text/70 mb-2 font-sans">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Selected items (tags) -->
    <div v-if="selectedItems.length > 0" class="flex flex-wrap gap-2 mb-3">
      <span
        v-for="item in selectedItems"
        :key="item.value"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium font-sans bg-accent/10 text-accent border border-accent/20"
      >
        {{ item.label }}
        <button
          type="button"
          @click="removeItem(item.value)"
          class="hover:bg-accent/20 rounded-full p-0.5 transition-colors duration-200"
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
        class="relative flex items-start p-3 border rounded-lg cursor-pointer transition-all duration-200"
        :class="isSelected(option.value) 
          ? 'bg-accent/5 border-accent/40 hover:border-accent/60' 
          : 'border-text/20 hover:bg-text/5 hover:border-text/30'"
      >
        <div class="flex items-center h-6">
          <input
            type="checkbox"
            :name="name"
            :value="option.value"
            :checked="isSelected(option.value)"
            @change="toggleOption(option)"
            class="h-4 w-4 rounded border-text/20 text-accent focus:ring-accent"
          />
        </div>
        <div class="ml-3 flex-1">
          <span class="block text-sm font-medium font-sans text-text">
            {{ option.label }}
          </span>
          <span v-if="option.description" class="block text-xs text-text/50 font-sans mt-0.5">
            {{ option.description }}
          </span>
        </div>
      </label>
    </div>

    <!-- Hint text -->
    <p v-if="hint && !error" class="mt-2 text-sm text-text/50 font-sans">
      {{ hint }}
    </p>

    <!-- Error message -->
    <p v-if="error" class="mt-2 text-sm text-red-600 font-sans">
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