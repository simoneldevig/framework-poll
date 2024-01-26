<template>
	<div class="flex items-center justify-center w-screen h-screen font-medium">
		<div class="flex flex-grow items-center justify-center h-full text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
			<div class="max-w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96">
				<div class="flex items-center mb-6">
					<svg class="h-8 w-8 text-indigo-500 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
					</svg>
					<h4 class="font-semibold ml-3 text-lg dark:text-white">Frodo's Jobs</h4>
				</div>

					<BaseCheckbox v-for="todo in todos" v-model="todo.completed">
						{{ todo.text }}
					</BaseCheckbox>
					
					<button class="flex items-center w-full h-8 px-2 mt-2 text-sm font-medium rounded">
						<svg class="w-5 h-5 text-gray-400 fill-current" xmlns="http://www.w3.org/2000/svg" @click="addNewTodo" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
						</svg>
						<BaseInput placeholder="add a new task" v-model="newTodo" @keyup.enter="addNewTodo" />
					</button>
				</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import BaseCheckbox from './BaseCheckbox.vue';
	import BaseInput from './BaseInput.vue';
	import { useLocalStorage } from '@vueuse/core'

	interface Todo {
		text: string;
		completed: boolean;
	}

	const newTodo = ref('');
	const todos = ref<Todo[]>([{
		text: 'Learn Vue 3',
		completed: false,
	}, {
		text: 'Learn TypeScript',
		completed: true,
	}, {
		text: 'Learn Tailwind CSS',
		completed: true,
	}]);

	useLocalStorage(
		'todos',
		todos,
	);

	const addNewTodo = () => {
		if (newTodo.value) {
			todos.value.push({
				text: newTodo.value,
				completed: false,
			});
			newTodo.value = '';
		}
	};
</script>
