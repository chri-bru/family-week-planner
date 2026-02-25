<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Meal } from '$lib/server/db/schema/meals';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import MealItemForm from './meal-item-form.svelte';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import { enhance } from '$app/forms';
	import AddMealDialog from './add-meal-dialog.svelte';

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
			<AddMealDialog {meal} title="Edit your meal" description="You can edit this meal here.">
				<Button variant="default" size="icon-lg" aria-label="Edit">
					<PencilIcon />
				</Button>
			</AddMealDialog>
		{/if}
	</Item.Actions>
</Item.Root>
