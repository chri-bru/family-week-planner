<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Meal } from '$lib/server/db/schema/meals';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import MealItemForm from './meal-item-form.svelte';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import { enhance } from '$app/forms';

	let { meal, editMode }: { meal: Meal; editMode: boolean } = $props();

	let isLoading = $state(false);
	let hasChanges = $state(false);
</script>

<Item.Root>
	<Item.Content>
		<Item.Title>{meal.name}</Item.Title>
		<Item.Description>{meal.type}</Item.Description>
	</Item.Content>
	<Item.Actions>
		{#if editMode}
			<Dialog.Root>
				<form method="POST" action="?/delete">
					<Dialog.Trigger>
						<Button variant="destructive" size="icon-lg" aria-label="Delete">
							<TrashIcon />
						</Button>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Delete meal {meal.name}</Dialog.Title>
							<Dialog.Description
								>This will permanently delete this meal. Are you sure?</Dialog.Description
							>
						</Dialog.Header>
						<Dialog.Footer>
							<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
								Cancel
							</Dialog.Close>
							<Button type="submit">Delete meal</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</form>
			</Dialog.Root>

			<Dialog.Root>
				<form
					method="POST"
					action="?/save"
					use:enhance={() => {
						isLoading = true;
						return async ({ update }) => {
							await update();
							isLoading = false;
						};
					}}
				>
					<Dialog.Trigger>
						<Button variant="default" size="icon-lg" aria-label="Edit">
							<PencilIcon />
						</Button>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Edit meal</Dialog.Title>
							<Dialog.Description>You can edit your meal here.</Dialog.Description>
						</Dialog.Header>
						<MealItemForm {meal} bind:hasChanges />
						<Dialog.Footer>
							<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
								Cancel
							</Dialog.Close>

							<Button
								type="submit"
								aria-label="Save button"
								disabled={isLoading || !hasChanges}
							>
								{isLoading ? 'Saving...' : 'Save changes'}
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</form>
			</Dialog.Root>
		{/if}
	</Item.Actions>
</Item.Root>
