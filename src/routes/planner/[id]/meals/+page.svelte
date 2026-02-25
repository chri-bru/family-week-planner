<script lang="ts">
	import type { Meal } from '$lib/server/db/schema/meals.js';
	import MealCards from './meal-cards.svelte';

	let { data } = $props();

	type GroupedMeals = {
		date: string;
		meals: Meal[];
	};

	const groupedMeals: GroupedMeals[] = $derived.by(() => {
		const today = new Date();
		const day = today.getDay();
		const diff = today.getDate() - day + (day === 0 ? -6 : 1);

		const weekStart = new Date(today);
		weekStart.setDate(diff);

		const groups: Record<string, Meal[]> = {};

		for (let i = 0; i < 7; i++) {
			const date = new Date(weekStart);
			date.setDate(weekStart.getDate() + i);
			const dateKey = date.toISOString().split('T')[0];
			groups[dateKey] = [];
		}

		for (const meal of data.meals) {
			const dateKey = meal.date;
			if (!groups[dateKey]) {
				groups[dateKey] = [];
			}
			groups[dateKey].push(meal);
		}

		return Object.entries(groups)
			.map(([date, meals]) => ({ date, meals }))
			.sort((a, b) => a.date.localeCompare(b.date));
	});
</script>

<div class="flex flex-col gap-4 w-full items-center">
	{#each groupedMeals as meal}
		<MealCards date={meal.date} meals={meal.meals} />
	{/each}
</div>
