<template>
  <input class="flex-grow h-8 ml-4 bg-transparent focus:outline-none font-medium" :type="type" v-model="model" :placeholder="placeholder"> 
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
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
