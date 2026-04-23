<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as Item from '$lib/components/ui/item/index.js';
	import { deleteMealAction } from '$lib/forms/meals.remote';
	import type { Meal } from '$lib/server/db/schema/meals';
	import MealItem from './meal-item.svelte';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';

	let { meals, editMode }: { meals: Meal[]; editMode: boolean } = $props();

	async function deleteFn(meal: Meal) { 
		await deleteMealAction({ id: meal.id });
		await invalidateAll()
	}
</script>

<Item.Group>
	{#if meals.length === 0}
		<p class="text-sm text-gray-500">No meals planned</p>
	{:else}
		{#each meals as meal}
			{#if meal.link}
				<a href={meal.link}>
					<MealItem {meal} {editMode} {deleteFn}>
						<ExternalLinkIcon class="size-4" />
					</MealItem>
				</a>
			{:else}
				<MealItem {meal} {editMode} {deleteFn}/>
			{/if}
		{/each}
	{/if}
</Item.Group>
