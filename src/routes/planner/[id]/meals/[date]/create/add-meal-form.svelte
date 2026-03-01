<script lang="ts">
	import { addMeal } from './meals.remote';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Field from '$lib/components/ui/field';

	let { date }: { date: string } = $props();

	addMeal.fields.type.set('dinner');
	addMeal.fields.date.set(date);
</script>

<form
	{...addMeal}
	class="w-2/3 space-y-6"
>
	<Field.Group>
		<Field.Field>
			<Field.Label for="name">Meal to cook</Field.Label>
			<Input {...addMeal.fields.name.as('text')} placeholder="Meal name" />
			{#each addMeal.fields.name.issues() as issue}
				<Field.Error class="issue">{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<Field.Field>
			<Field.Label for="date">Date</Field.Label>
			<Input
				{...addMeal.fields.date.as('text')}
				placeholder="Date"
				type="date"
				readonly
				aria-readonly="true"
			/>
		</Field.Field>

		<Field.Field>
			<Field.Label for="type">Type</Field.Label>
			<select
				{...addMeal.fields.type.as('text')}
				class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
			>
				<option value="breakfast">Breakfast</option>
				<option value="lunch">Lunch</option>
				<option value="dinner">Dinner</option>
				<option value="snack">Snack</option>
				<option value="special">Special</option>
			</select>
			{#each addMeal.fields.type.issues() as issue}
				<Field.Error class="issue">{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<Field.Field>
			<Field.Label for="link">Link (optional)</Field.Label>
			<Input {...addMeal.fields.link.as('text')} placeholder="https://..." type="url" />
		</Field.Field>
	</Field.Group>

	<Button type="submit">Create Meal</Button>
</form>
