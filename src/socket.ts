import { reactive } from "vue";
import { io } from "socket.io-client";

interface State {
  connected: boolean;
  votesEvents: any[];
  voteEvents: any[];
  unvoteEvents: any[];
};

export const state = reactive<State>({
  connected: false,
  votesEvents: [],
  voteEvents: [],
  unvoteEvents: [],
});


export const socket = io(import.meta.env.VITE_SOCKET_URL || 'localhost:3005');

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("votes", (...args) => {
  state.votesEvents.push(args);
});

socket.on("vote", (...args) => {
  state.voteEvents.push(args);
});

socket.on("unvote", (...args) => {
  state.unvoteEvents.push(args);
});
