<script lang="ts">
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import type { ChoreFrequency, Task } from '#lib/server/db/schema/tasks.js';
	import { deleteTaskAction } from '#lib/forms/tasks.remote.js';
	import { refreshAll } from '$app/navigation';
	import type { Snippet } from 'svelte';

	let {
		task,
		familyId,
		choreFrequency = null,
		children
	}: {
		task: Task;
		familyId: string;
		choreFrequency?: ChoreFrequency | null;
		children: Snippet;
	} = $props();

	const frequencyLabels: Record<ChoreFrequency, string> = {
		weekly: 'weekly',
		monthly: 'monthly',
		quarterly: 'quarterly',
		half_yearly: 'half-yearly',
		yearly: 'yearly'
	};

	let dialogOpen = $state(false);
	let deleting = $state(false);
	let errorMessage = $state<string | null>(null);

	const isChore = $derived(task.chore !== null);
	const frequencyLabel = $derived(
		isChore && choreFrequency ? frequencyLabels[choreFrequency] : null
	);

	async function confirmDelete() {
		deleting = true;
		errorMessage = null;
		try {
			await deleteTaskAction({
				familyPlanId: familyId,
				taskId: task.id,
				choreId: task.chore
			});
			await refreshAll();
			dialogOpen = false;
		} catch {
			errorMessage = 'Could not delete this item. Please try again.';
		} finally {
			deleting = false;
		}
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger
		class="{buttonVariants({
			variant: 'ghost',
			size: 'icon'
		})} text-destructive hover:text-destructive"
		aria-label="Delete task"
		onclick={(event) => {
			event.stopPropagation();
			errorMessage = null;
		}}
	>
		{@render children()}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{isChore ? 'Delete chore' : 'Delete task'}</Dialog.Title>
			<Dialog.Description>
				{#if isChore}
					This will permanently delete this{frequencyLabel ? ` ${frequencyLabel}` : ''} chore and all
					completed task history. Are you sure?
				{:else}
					This will permanently delete this task. Are you sure?
				{/if}
			</Dialog.Description>
		</Dialog.Header>
		{#if errorMessage}
			<p class="text-sm text-destructive" role="alert">{errorMessage}</p>
		{/if}
		<Dialog.Footer>
			<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
				Cancel
			</Dialog.Close>
			<Button onclick={confirmDelete} variant="destructive" type="button" disabled={deleting}>
				{deleting ? 'Deleting...' : 'Delete'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
