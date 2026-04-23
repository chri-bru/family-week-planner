<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Meal } from '$lib/server/db/schema/meals';
	import type { Snippet } from 'svelte';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input/index.js';
	import { updateMealAction } from '$lib/forms/meals.remote';
	import { invalidateAll } from '$app/navigation';

	let { meal, children }: { meal: Meal; children: Snippet } = $props();

	let title = 'Edit your meal';
	let description = 'You can edit this meal here.';

	let updatedMeal = $state(meal)
	let dialogOpen = $state(false);
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger>
		{@render children()}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
		</Dialog.Header>
		<Field.Group>
			<Field.Field>
				<Field.Label for="name">Meal to cook</Field.Label>
				<Input bind:value={updatedMeal.name} placeholder="Meal name" />
			</Field.Field>

			<Field.Field>
				<Field.Label for="date">Date</Field.Label>
				<Input
					bind:value={meal.date}
					placeholder="Date"
					type="date"
					aria-readonly="true"
				/>
			</Field.Field>

			<Field.Field>
				<Field.Label for="type">Type</Field.Label>
				<select bind:value={updatedMeal.type}
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
				<Input bind:value={updatedMeal.link} placeholder="https://..." type="url" />
			</Field.Field>
		</Field.Group>
		
		<Dialog.Footer>
			<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
				Cancel
			</Dialog.Close>

			<Button  onclick={async () => {
							await updateMealAction({
								id: updatedMeal.id,
								name: updatedMeal.name,
								date: updatedMeal.date,
								type: updatedMeal.type,
								link: updatedMeal.link ?? undefined
							});
							await invalidateAll();
							dialogOpen = false;
						}} aria-label="Save button">
				Update Meal
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
