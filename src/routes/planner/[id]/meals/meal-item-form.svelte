<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field';
	import type { Meal, MealType } from '$lib/server/db/schema/meals';

	let { hasChanges = $bindable(), meal }: { hasChanges: boolean; meal: Meal } = $props();

	let name = $derived(meal.name ?? '')
	let date = $derived(meal.date ?? transformToCorrectDateFormat(new Date()))
	let type = $derived(meal.type as MealType ?? 'dinner')
	let link = $derived(meal.link ?? '')

	function transformToCorrectDateFormat(date: string | Date): string {
		const asDate = new Date(date)
		return asDate.toISOString().split('T')[0] // YYYY-MM-dd
	}

	let isEditing = $derived(!!meal);

	$effect(() => {
		hasChanges =
			isEditing && meal
				? name !== meal.name ||
					date !== meal.date ||
					type !== meal.type ||
					link !== (meal.link ?? '')
				: name.length > 0;
	});
</script>

<input type="hidden" name="id" value={meal?.id} />
<Field.Field>
	<Field.Label for="name">Name</Field.Label>
	<Input id="name" name="name" bind:value={name} placeholder="Meal name" />
</Field.Field>

<Field.Field>
	<Field.Label for="date">Date</Field.Label>
	<Input id="date" name="date" type="date" bind:value={date} />
</Field.Field>

<Field.Field>
	<Field.Label for="type">Type</Field.Label>
	<select
		id="type"
		name="type"
		bind:value={type}
		class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
	>
		<option value="breakfast">Breakfast</option>
		<option value="lunch">Lunch</option>
		<option value="dinner">Dinner</option>
		<option value="snack">Snack</option>
		<option value="special">Special</option>
	</select>
</Field.Field>

<Field.Field>
	<Field.Label for="link">Link (optional)</Field.Label>
	<Input id="link" name="link" bind:value={link} placeholder="https://..." />
</Field.Field>
