<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Meal } from '$lib/server/db/schema/meals';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import UpdateMealDialog from './update-meal-dialog.svelte';
	import type { Snippet } from 'svelte';
	import MealIcon from './meal-icon.svelte';

	let { meal, editMode, deleteFn, children }: { meal: Meal; editMode: boolean; deleteFn: (meal: Meal) => Promise<void>; children?: Snippet } = $props();

	let dialogOpen = $state(false);
</script>

<Item.Root>
	<Item.Media variant="icon">
		<MealIcon type={meal.type} />
	</Item.Media>
	<Item.Content>
		<Item.Title>{meal.name}</Item.Title>
		<Item.Description>{meal.type}</Item.Description>
	</Item.Content>
	<Item.Actions>
		{#if editMode}
			<Dialog.Root bind:open={dialogOpen}>
				<Dialog.Trigger>
					<Button variant="destructive" size="icon-lg" aria-label="Delete">
						<TrashIcon />
					</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Delete {meal.name}</Dialog.Title>
						<Dialog.Description
							>This will permanently delete this meal. Are you sure?</Dialog.Description
						>
					</Dialog.Header>
					<Dialog.Footer>
						<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
							Cancel
						</Dialog.Close>
						<Button onclick={async () => {
							await deleteFn(meal);
							dialogOpen = false;
						}} variant="destructive" type="button">
							Delete
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
			<UpdateMealDialog {meal}>
				<Button variant="default" size="icon-lg" aria-label="Edit">
					<PencilIcon />
				</Button>
			</UpdateMealDialog>
		{:else}
			{@render children?.()}
		{/if}
	</Item.Actions>
</Item.Root>
