<script lang="ts">
	import { toDateString } from "$lib/utils";
	import MealCards from "../meals/meal-cards.svelte";
	import type { PageData } from "./$types";

	// overview page for the current day,
	// showing the meals planned for today and any tasks

	let { data }: { data: PageData } = $props();
</script>

<div class="flex w-full flex-col items-center gap-4">
	<MealCards date={toDateString(new Date())} meals={data.meals} readOnly={true} />
</div>
