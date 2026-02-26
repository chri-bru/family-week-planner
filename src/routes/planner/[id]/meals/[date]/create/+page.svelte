<script lang="ts">
	import type { PageData } from './$types.js';
	import AddMealForm from './add-meal-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<AddMealForm {data} />