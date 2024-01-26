<template>
  <div>
    <input
      v-model="model"
      class="hidden"
      type="checkbox"
      :id="id"
    />
    <label
      class="flex items-center h-10 px-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900"
      :for="id"
    >
      <span
        class="flex items-center justify-center w-5 h-5 text-transparent border-2 border-gray-300 dark:border-gray-500 rounded-full" :class="{'text-white bg-emerald-500 !border-emerald-500': model}"
      >
        <svg
          class="w-4 h-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <span class="ml-4 text-sm" :class="{'text-gray-400 line-through': model}"><slot></slot></span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, ref } from 'vue';
import { uid } from 'uid';

const props = defineProps({
  modelValue: { type: Boolean },
});
const emit = defineEmits(['update:modelValue']);
const id = ref(uid());
const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>
