<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { toDateString } from "$lib/utils";
	import MealCards from "../meals/meal-cards.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let mealUrl = $derived(() => `/planner/${data.familyId}/meals`);
</script>

<div class="flex w-full flex-col items-center gap-4">
	<MealCards date={toDateString(new Date())} meals={data.meals} readOnly={true}>
		<Button size="lg" href={mealUrl()}>Go to meal planning</Button>
	</MealCards>
</div>
