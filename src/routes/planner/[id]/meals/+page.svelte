<script lang="ts">
	import type { Meal } from '$lib/server/db/schema/meals.js';
	import MealCards from './meal-cards.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import AddIcon from '@lucide/svelte/icons/plus';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

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

<div class="flex w-full flex-col items-center gap-4">
	{#each groupedMeals as meal}
		<MealCards date={meal.date} meals={meal.meals}>
			<Button
				href={`/planner/${data.familyId}/meals/${meal.date}/create`}
				variant="default"
				size="icon-lg"
				aria-label="Add"
			>
				<AddIcon />
			</Button>
		</MealCards>
	{/each}
</div>
