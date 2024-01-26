<template>
  <label class="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" v-model="model" class="sr-only peer">
    <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-500"></div>
    <span class="ms-3 text-sm font-medium text-gray-600 dark:text-gray-200"><slot></slot></span>
  </label>
</template>

<script setup lang="ts">
import { computed, defineEmits } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean },
});
const emit = defineEmits(['update:modelValue']);
const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>
