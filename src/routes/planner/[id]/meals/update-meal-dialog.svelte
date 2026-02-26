<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Meal } from '$lib/server/db/schema/meals';
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';

	let { meal, children }: { meal: Meal; children: Snippet } = $props();

	let isLoading = $state(false);

	let title = 'Edit your meal';
	let description = 'You can edit this meal here.';
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
			<!-- TODO add update dialog -->
			<Dialog.Footer>
				<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
					Cancel
				</Dialog.Close>

				<Button type="submit" aria-label="Save button" disabled={isLoading}>
					{isLoading ? 'Saving...' : 'Save changes'}
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</form>
</Dialog.Root>
