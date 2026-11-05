<script lang="ts">
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import type { ChoreFrequency, Task } from '#lib/server/db/schema/tasks.js';
	import { updateTaskAction } from '#lib/forms/tasks.remote.js';
	import { refreshAll } from '$app/navigation';
	import { untrack, type Snippet } from 'svelte';
	import { toDateString } from '#lib/utils.js';

	type Member = {
		userId: string;
		username: string | null;
	};

	const frequencies: { value: ChoreFrequency; label: string }[] = [
		{ value: 'weekly', label: 'Weekly' },
		{ value: 'monthly', label: 'Monthly' },
		{ value: 'quarterly', label: 'Quarterly' },
		{ value: 'half_yearly', label: 'Half-yearly' },
		{ value: 'yearly', label: 'Yearly' }
	];

	let {
		task,
		familyId,
		members,
		choreFrequency,
		children
	}: {
		task: Task;
		familyId: string;
		members: Member[];
		choreFrequency: ChoreFrequency | null;
		children: Snippet;
	} = $props();

	const isChore = $derived(task.chore !== null);

	let edited = $state(
		untrack(() => ({
			title: task.title,
			description: task.description ?? '',
			dueDate: task.dueDate ?? (task.chore !== null ? toDateString(new Date()) : ''),
			assignedTo: task.assignedTo ?? '',
			frequency: (choreFrequency ?? 'monthly') as ChoreFrequency
		}))
	);
	const canSave = $derived(
		edited.title.trim().length > 0 && (!isChore || edited.dueDate.length > 0)
	);

	let dialogOpen = $state(false);
	let saving = $state(false);
	let errorMessage = $state<string | null>(null);

	async function save() {
		saving = true;
		errorMessage = null;
		try {
			await updateTaskAction({
				familyPlanId: familyId,
				taskId: task.id,
				choreId: task.chore,
				title: edited.title,
				description: edited.description,
				dueDate: edited.dueDate,
				assignedTo: edited.assignedTo,
				frequency: isChore ? edited.frequency : undefined,
				isChore
			});
			await refreshAll();
			dialogOpen = false;
		} catch {
			errorMessage = 'Could not save changes. Please try again.';
		} finally {
			saving = false;
		}
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'ghost', size: 'icon' })}
		aria-label="Edit task"
		onclick={(event) => {
			event.stopPropagation();
			errorMessage = null;
		}}
	>
		{@render children()}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>{isChore ? 'Edit chore' : 'Edit task'}</Dialog.Title>
			<Dialog.Description>
				{isChore ? 'Update this recurring chore.' : 'Update this task.'}
			</Dialog.Description>
		</Dialog.Header>

		<Field.Group>
			<Field.Field>
				<Field.Label for="task-title">Title</Field.Label>
				<Input id="task-title" bind:value={edited.title} placeholder="Task title" />
			</Field.Field>

			<Field.Field>
				<Field.Label for="task-description">Description</Field.Label>
				<textarea
					id="task-description"
					bind:value={edited.description}
					placeholder="Add details (optional)"
					class="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
				></textarea>
			</Field.Field>

			<Field.Field>
				<Field.Label for="task-due-date">Due date</Field.Label>
				<Input id="task-due-date" bind:value={edited.dueDate} type="date" required={isChore} />
			</Field.Field>

			<Field.Field>
				<Field.Label for="task-assignee">Assignee</Field.Label>
				<select
					id="task-assignee"
					bind:value={edited.assignedTo}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
				>
					<option value="">Unassigned</option>
					{#each members as member (member.userId)}
						<option value={member.userId}>{member.username ?? 'Unnamed member'}</option>
					{/each}
				</select>
			</Field.Field>

			{#if isChore}
				<Field.Field>
					<Field.Label for="task-frequency">Frequency</Field.Label>
					<select
						id="task-frequency"
						bind:value={edited.frequency}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					>
						{#each frequencies as frequency (frequency.value)}
							<option value={frequency.value}>{frequency.label}</option>
						{/each}
					</select>
				</Field.Field>
			{/if}
		</Field.Group>

		{#if errorMessage}
			<p class="text-sm text-destructive" role="alert">{errorMessage}</p>
		{/if}

		<Dialog.Footer>
			<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
				Cancel
			</Dialog.Close>
			<Button onclick={save} type="button" disabled={saving || !canSave}>
				{saving ? 'Saving...' : 'Save changes'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
