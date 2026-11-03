<script lang="ts">
	import { refreshAll } from '$app/navigation';
	import * as Item from '#lib/components/ui/item/index.js';
	import { deleteMealAction } from '#lib/forms/meals.remote.js';
	import type { Meal } from '#lib/server/db/schema/meals.js';
	import MealItem from './meal-item.svelte';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';

	let {
		meals,
		editMode,
		familyPlanId
	}: { meals: Meal[]; editMode: boolean; familyPlanId: string } = $props();

	async function deleteFn(meal: Meal) {
		await deleteMealAction({ id: meal.id, familyPlanId });
		await refreshAll();
	}
</script>

<Item.Group>
	{#if meals.length === 0}
		<p class="text-sm text-gray-500">No meals planned</p>
	{:else}
		{#each meals as meal (meal.id)}
			{#if meal.link}
				<a href={meal.link}>
					<MealItem {meal} {editMode} {familyPlanId} {deleteFn}>
						<ExternalLinkIcon class="size-4" />
					</MealItem>
				</a>
			{:else}
				<MealItem {meal} {editMode} {familyPlanId} {deleteFn} />
			{/if}
		{/each}
	{/if}
</Item.Group>
