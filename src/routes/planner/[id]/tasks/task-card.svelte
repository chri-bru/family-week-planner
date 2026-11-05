<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import type { ChoreFrequency, Task } from '#lib/server/db/schema/tasks.js';
	import { completeTaskAction } from '#lib/forms/tasks.remote.js';
	import { refreshAll } from '$app/navigation';
	import CheckIcon from '@lucide/svelte/icons/check';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import TaskIcon from './task-icon.svelte';
	import EditTaskDialog from './edit-task-dialog.svelte';
	import DeleteTaskDialog from './delete-task-dialog.svelte';

	type Member = {
		userId: string;
		username: string | null;
	};

	let {
		task,
		familyId,
		members,
		choreFrequency
	}: {
		task: Task;
		familyId: string;
		members: Member[];
		choreFrequency: ChoreFrequency | null;
	} = $props();

	let menuOpen = $state(false);
	let completing = $state(false);
	let errorMessage = $state<string | null>(null);

	const assigneeName = $derived.by(() => {
		if (!task.assignedTo) return null;
		const member = members.find((item) => item.userId === task.assignedTo);
		return member?.username ?? member?.userId ?? task.assignedTo;
	});

	function formatDueDate(value: string): string {
		const [year, month, day] = value.split('-').map(Number);

		if (!year || !month || !day) {
			return value;
		}

		return new Date(year, month - 1, day).toLocaleDateString(undefined, {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}

	async function completeTask() {
		if (completing) return;

		completing = true;
		errorMessage = null;
		try {
			await completeTaskAction({ familyPlanId: familyId, taskId: task.id });
			await refreshAll();
		} catch {
			errorMessage = 'Could not complete this task. Please try again.';
		} finally {
			completing = false;
		}
	}
</script>

<Card.Root class="relative w-full max-w-sm">
	<button
		type="button"
		class="absolute inset-0 z-0 cursor-pointer appearance-none rounded-xl border-0 bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
		aria-label={menuOpen ? 'Hide task actions' : 'Show task actions'}
		aria-expanded={menuOpen}
		onclick={() => (menuOpen = !menuOpen)}
	></button>

	<Card.Header class="pointer-events-none">
		<Card.Title class="flex min-w-0 items-center gap-2 pr-2">
			<TaskIcon choreId={task.chore} />
			<span class="min-w-0 break-words">{task.title}</span>
		</Card.Title>
		<Card.Action class="pointer-events-auto relative z-10">
			<Button
				variant="outline"
				size="icon"
				aria-label="Complete task"
				disabled={completing}
				onclick={(event) => {
					event.stopPropagation();
					completeTask();
				}}
			>
				<CheckIcon />
			</Button>
		</Card.Action>
	</Card.Header>

	<Card.Content class="pointer-events-none space-y-2">
		{#if task.description}
			<p class="text-sm whitespace-pre-line text-muted-foreground">{task.description}</p>
		{/if}

		{#if assigneeName}
			<p class="text-sm">
				<span class="text-muted-foreground">Assigned to </span>
				<span class="font-medium">{assigneeName}</span>
			</p>
		{/if}

		<p class="text-sm">
			<span class="text-muted-foreground">Due </span>
			<span class="font-medium">
				{task.dueDate ? formatDueDate(task.dueDate) : 'No due date'}
			</span>
		</p>

		{#if errorMessage}
			<p class="text-sm text-destructive" role="alert">{errorMessage}</p>
		{/if}
	</Card.Content>

	{#if menuOpen}
		<Card.Footer class="pointer-events-auto relative z-10 justify-end gap-2 border-t">
			<EditTaskDialog {task} {familyId} {members} {choreFrequency}>
				<PencilIcon class="size-4" />
			</EditTaskDialog>
			<DeleteTaskDialog {task} {familyId} {choreFrequency}>
				<TrashIcon class="size-4" />
			</DeleteTaskDialog>
		</Card.Footer>
	{/if}
</Card.Root>
