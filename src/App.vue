<template>
  <main class="flex flex-col w-dvw h-dvh justify-center gap-4 sm:gap-6 bg-slate-200">
      <h1 class="text-5xl font-extrabold text-center">Vote for</h1>
      <div class="flex items-center justify-center gap-4 h-96 container mx-auto px-4 overflow-hidden">
        <div class="flex w-2/6 flex-col h-full justify-center">
          <Bar name="Vue" :votes="votes.vue" :votes-percentage="votesPercentage.vue" />
          <button @click="vote('vue')" class="mt-4 self-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">
            Vote
          </button>
        </div>
        <div class="flex w-2/6 flex-col h-full justify-center">
          <Bar name="React" :votes="votes.react" :votes-percentage="votesPercentage.react" />
          <button @click="vote('react')" class="mt-4 self-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">
            Vote
          </button>
        </div>
        <div class="flex w-2/6 flex-col h-full justify-center">
          <Bar name="Blazor" :votes="votes.blazor" :votes-percentage="votesPercentage.blazor" />
          <button @click="vote('blazor')" class="mt-4 self-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">
            Vote
          </button>
        </div>
      </div>
      <h2 class="text-center text-lg font-semibold">Total {{ votes.vue + votes.react }} votes</h2>
      <button
        @click="vote('none')"
        class="self-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
      >
        Remove your vote {{ voted !== 'none' ? `(${ voted })` : '' }}
      </button>
  </main>
</template>

<script setup lang="ts">
  import {ref, onMounted, onUnmounted, watch}  from 'vue';
  import io from 'socket.io-client';
  import { useSessionStorage } from '@vueuse/core';
  import Bar from './components/Bar.vue';

  const socket = io(import.meta.env.VITE_SOCKET_URL || 'localhost:3005');
  const voted = ref('none');
  useSessionStorage('voted', voted);
  const votes = ref<{[key: string]: number}>({ vue: 0, react: 0, blazor: 0 });
  const votesPercentage = ref<{[key: string]: number | string}>({ vue: 0, react: 0, blazor: 0 });

  watch(votes, () => {
    const totalVotes = votes.value.vue + votes.value.react + votes.value.blazor;

    votesPercentage.value = {
      vue: totalVotes > 0 ? ((votes.value.vue * 100) / (totalVotes)).toFixed(2) : 0,
      react: totalVotes > 0 ? ((votes.value.react * 100) / (totalVotes)).toFixed(2) : 0,
      blazor: totalVotes > 0 ? ((votes.value.blazor * 100) / (totalVotes)).toFixed(2) : 0,
    }
  }, {immediate: true, deep: true});

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

  const vote = (who: 'vue' | 'react' | 'blazor' | 'none') => {
    console.log(voted.value, who);
    if (voted.value === who) return

    if (voted.value !== 'none' || who === 'none') {
      const previousVoted = voted
      socket.emit('unvote', previousVoted.value);

      votes.value[previousVoted.value] > 0 ? votes.value[previousVoted.value]-- : votes.value[previousVoted.value] = 0;
    }

    voted.value = who;
    socket.emit('vote', who)
    votes.value[who]++;
  };

</script>
