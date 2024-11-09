<template>
	<div class="app">
		<Main />
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import Main from './views/Main.vue';
export default defineComponent({
	name: 'App',
	components: {
		Main
	},
	setup() {
	},
});
</script>
