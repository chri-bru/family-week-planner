<script lang="ts">
	import * as Item from '$lib/components/ui/item/index.js';
	import type { Meal } from '$lib/server/db/schema/meals';
	import MealItemLink from './meal-item-link.svelte';
	import MealItem from './meal-item.svelte';

	let { meals, editMode }: { meals: Meal[]; editMode: boolean } = $props();
</script>

<Item.Group>
	{#each meals as meal}
		{#if meal.link && !editMode}
			<MealItemLink {meal} />
		{:else}
			<MealItem {meal} {editMode} />
		{/if}
	{/each}
</Item.Group>
