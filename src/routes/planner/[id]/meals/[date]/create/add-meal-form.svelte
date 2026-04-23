<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Field from '$lib/components/ui/field';
	import { addMealAction } from '$lib/forms/meals.remote';
	
	let { date }: { date: string } = $props();

	addMealAction.fields.type.set('dinner');
	addMealAction.fields.date.set(date);
</script>

<form
	{...addMealAction}
	class="w-2/3 space-y-6"
>
	<Field.Group>
		<Field.Field>
			<Field.Label for="name">Meal to cook</Field.Label>
			<Input {...addMealAction.fields.name.as('text')} placeholder="Meal name" />
			{#each addMealAction.fields.name.issues() as issue}
				<Field.Error class="issue">{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<Field.Field>
			<Field.Label for="date">Date</Field.Label>
			<Input
				{...addMealAction.fields.date.as('text')}
				placeholder="Date"
				type="date"
				readonly
				aria-readonly="true"
			/>
		</Field.Field>

		<Field.Field>
			<Field.Label for="type">Type</Field.Label>
			<select
				{...addMealAction.fields.type.as('text')}
				class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
			>
				<option value="breakfast">Breakfast</option>
				<option value="lunch">Lunch</option>
				<option value="dinner">Dinner</option>
				<option value="snack">Snack</option>
				<option value="special">Special</option>
			</select>
			{#each addMealAction.fields.type.issues() as issue}
				<Field.Error class="issue">{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<Field.Field>
			<Field.Label for="link">Link (optional)</Field.Label>
			<Input {...addMealAction.fields.link.as('text')} placeholder="https://..." type="url" />
		</Field.Field>
	</Field.Group>

	<Button type="submit">Create Meal</Button>
</form>
