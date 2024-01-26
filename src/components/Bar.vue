<template>
  <div
    class="flex flex-col gap-2 items-center justify-center aspect-square h-full rounded-xl border-2 relative overflow-hidden"
  >
    <h2 class="text-lg font-semibold">{{ props.name }}</h2>
    <div class="font-light text-sm text-center">
      <p>{{ props.votes }} votes</p>
      <p>{{ props.votesPercentage }}%</p>
    </div>
    <div
      :style="{ height: props.votesPercentage + '%' }"
      class="absolute left-0 right-0 bottom-0 bg-purple-700 bg-opacity-25 rounded-lg transition-all duration-700"
    ></div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    name: { type: String, required: true },
    votes: { type: Number, required: true },
    votesPercentage: { type: [Number, String], required: true },
  });

  const emit = defineEmits(['click']);
</script>
