<template>
  <main class="flex flex-col w-dvw h-dvh justify-center gap-4 sm:gap-6 bg-slate-200">
      <h1 class="text-5xl font-extrabold text-center">Vote for</h1>
      <div class="flex items-center justify-center gap-4 h-96 container mx-auto px-6 overflow-hidden">
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

      <a href="https://github.com/simoneldevig/framework-poll" title="Github repository" target="_blank">
        <svg aria-hidden="true" focusable="false" role="img" class="StyledOcticon-sc-1lhyyr-0 kDaXaG" viewBox="0 0 16 16" width="NaN" height="28px" fill="currentColor" style="display: inline-block;overflow: visible;vertical-align: text-bottom;user-select: none;"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 01-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 010 8c0-4.42 3.58-8 8-8z"></path></svg>
      </a>
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
