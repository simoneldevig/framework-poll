<template>
  <main class="flex flex-col w-screen h-screen justify-center gap-4 sm:gap-6 bg-slate-200">
    <h1 class="text-5xl font-extrabold text-center">Vote for</h1>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 h-2/3 sm:h-1/3">
      <button
        :class="[
          'flex flex-col gap-2 items-center justify-center aspect-square h-full rounded-xl border-2 relative overflow-hidden',
          voted === 'vue' ? 'border-green-400' : ''
        ]"
        @click="vote('vue')"
      >
        <h2 class="text-lg font-semibold">Vue</h2>
        <div class="font-light text-sm">
          {{ votes.vue }} votes · {{ votesPercentage.vue }}%
        </div>
        <div
          :style="{ height: votesPercentage.vue + '%' }"
          class="absolute left-0 right-0 bottom-0 bg-pink-400 bg-opacity-50 rounded-lg transition-all duration-700"
        ></div>
      </button>
      <div>OR</div>
      <button
        :class="[
          'flex flex-col gap-2 items-center justify-center aspect-square h-full rounded-xl border-2 relative overflow-hidden',
          voted === 'dog' ? 'border-green-400' : ''
        ]"
        @click="vote('react')"
      >
        <h2 class="text-lg font-semibold">React</h2>
        <div class="font-light text-sm">
          {{ votes.react }} votes · {{ votesPercentage.react }}%
        </div>
        <div
          :style="{ height: votesPercentage.react + '%' }"
          class="absolute left-0 right-0 bottom-0 bg-pink-400 bg-opacity-50 rounded-lg transition-all duration-700"
        ></div>
      </button>
    </div>
    <h2 class="text-center text-lg font-semibold">Total {{ votes.vue + votes.react }} votes</h2>
    <button
      @click="vote('none')"
      class="self-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
    >
      Remove your vote
    </button>
  </main>
</template>

<script setup lang="ts">
  import {ref, computed, watch, onMounted, onUnmounted}  from 'vue';
  import io from 'socket.io-client';

  const socket = io(import.meta.env.VITE_SOCKET_URL || 'localhost:3005');
  const voted = ref('none');
  const votes = ref<{[key: string]: number}>({ vue: 0, react: 0, blazor: 0 });

  const votesPercentage = computed(() => {
    const totalVotes = votes.value.vue + votes.value.react + votes.value.blazor;

    return  {
        vue: totalVotes > 0 ? ((votes.value.vue * 100) / (totalVotes)).toFixed(2) : 0,
        react: totalVotes > 0 ? ((votes.value.react * 100) / (totalVotes)).toFixed(2) : 0,
        blazor: totalVotes > 0 ? ((votes.value.blazor * 100) / (totalVotes)).toFixed(2) : 0,
    }
  });

  watch(voted, (newValue, oldValue) => {
    if (newValue === 'none') {
      socket.emit('unvote', oldValue);
    }
  });

  onMounted(() => {  
    socket.on('votes', (voted: { vue: number; react: number; blazor: number }) => {
      votes.value.vue = voted.vue || 0;
      votes.value.react = voted.react || 0;
      votes.value.blazor = voted.blazor || 0;
    });
  });

  onUnmounted(() => {
    socket.offAny();
  });

  const vote = (who: string) => {
    if (voted.value === who) return

    if (voted.value !== 'none' || who === 'none') {
      const previousVoted = voted
      socket.emit('unvote', previousVoted);

      votes.value[previousVoted.value] > 0 ? votes.value[previousVoted.value]-- : votes.value[previousVoted.value] = 0;
    }

    voted.value = who;
    socket.emit('vote', who)
    votes.value[who]++;
  };

</script>

<style scoped>
.toggle {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
