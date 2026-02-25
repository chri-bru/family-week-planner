<script lang="ts">
	import type { Meal } from '$lib/server/db/schema/meals.js';
	import MealCards from './meal-cards.svelte';

	let { data } = $props();

	type GroupedMeals = {
		date: string;
		meals: Meal[];
	};

	if (data.meals.length === 0) {
		// Handle empty meals case, e.g., show a message or an empty state component
		data.meals = [{
			id: 1,
			name: 'Eggs',
			type: 'breakfast',
			date: new Date().toISOString().split('T')[0],
			link: null,
			family: null
		},{
			id: 2,
			name: 'Spagetthi',
			type: 'lunch',
			date: new Date().toISOString().split('T')[0],
			link: null,
			family: null
		},{
			id: 3,
			name: 'Bread',
			type: 'dinner',
			date: new Date().toISOString().split('T')[0],
			link: null,
			family: null
		}];
	}

	const groupedMeals: GroupedMeals[] = $derived.by(() => {
		const groups: Record<string, Meal[]> = {};
		for (const meal of data.meals) {
			const dateKey = meal.date;
			if (!groups[dateKey]) {
				groups[dateKey] = [];
			}
			groups[dateKey].push(meal);
		}
		return Object.entries(groups).map(([date, meals]) => ({ date, meals }));
	});
</script>
{#each groupedMeals as meal}
	<MealCards date={meal.date} meals={meal.meals} />
{/each}
