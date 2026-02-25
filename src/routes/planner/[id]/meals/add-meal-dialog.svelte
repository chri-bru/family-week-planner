<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Meal } from '$lib/server/db/schema/meals';
	import MealItemForm from './meal-item-form.svelte';
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';

	let {
		meal,
		title,
		description,
		children
	}: { meal: Meal; title: string; description: string; children: Snippet } = $props();

	let isLoading = $state(false);
	let hasChanges = $state(false);
</script>

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
			{@render children()}
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>{title}</Dialog.Title>
				<Dialog.Description>{description}</Dialog.Description>
			</Dialog.Header>
			<MealItemForm {meal} bind:hasChanges />
			<Dialog.Footer>
				<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
					Cancel
				</Dialog.Close>

				<Button type="submit" aria-label="Save button" disabled={isLoading || !hasChanges}>
					{isLoading ? 'Saving...' : 'Save changes'}
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</form>
</Dialog.Root>
