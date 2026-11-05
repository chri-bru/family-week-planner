<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import type { ChoreFrequency } from '#lib/server/db/schema/tasks.js';
	import type { PageData } from './$types';
	import TaskCard from './task-card.svelte';
	import SearchIcon from '@lucide/svelte/icons/search';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import ListFilterIcon from '@lucide/svelte/icons/list-filter';
	import ListTodoIcon from '@lucide/svelte/icons/list-todo';

	let { data }: { data: PageData } = $props();

	let search = $state('');
	let onlyMine = $state(false);

	const choreFrequencyById = $derived(
		new Map<number, ChoreFrequency>(data.chores.map((chore) => [chore.id, chore.frequency]))
	);

	const visibleTasks = $derived.by(() => {
		const query = search.trim().toLowerCase();

		const filtered = data.tasks.filter((task) => {
			const assignedToCurrentUser = task.assignedTo === data.currentUserId;
			const unassigned = task.assignedTo === null;

			if (onlyMine && !assignedToCurrentUser && !unassigned) {
				return false;
			}

			if (!query) {
				return true;
			}

			return (
				task.title.toLowerCase().includes(query) ||
				(task.description ?? '').toLowerCase().includes(query)
			);
		});

		return filtered.sort((a, b) => {
			if (a.dueDate === null && b.dueDate === null) {
				return 0;
			}

			if (a.dueDate === null) {
				return 1;
			}

			if (b.dueDate === null) {
				return -1;
			}

			return a.dueDate.localeCompare(b.dueDate);
		});
	});
</script>

<div class="flex w-full flex-col items-center gap-4">
	<div class="flex w-full max-w-sm items-center gap-2">
		<div class="relative min-w-0 flex-1">
			<SearchIcon
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
				aria-hidden="true"
			/>
			<Input
				bind:value={search}
				placeholder="Search tasks"
				aria-label="Search tasks"
				class="pl-9"
			/>
		</div>
		<Button
			variant={onlyMine ? 'default' : 'outline'}
			aria-pressed={onlyMine}
			onclick={() => (onlyMine = !onlyMine)}
		>
			<ListFilterIcon />
			Filter
		</Button>
		<Button href={`/planner/${data.familyId}/tasks/create`} size="icon-lg" aria-label="Add task">
			<PlusIcon />
		</Button>
	</div>

	{#if visibleTasks.length === 0}
		<Empty.Root class="w-full max-w-sm border">
			<Empty.Header>
				<Empty.Media variant="icon">
					<ListTodoIcon />
				</Empty.Media>
				<Empty.Title>
					{data.tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
				</Empty.Title>
				<Empty.Description>
					{data.tasks.length === 0
						? 'Create a task or recurring chore to get started.'
						: 'Try adjusting your search or filter.'}
				</Empty.Description>
			</Empty.Header>
		</Empty.Root>
	{:else}
		{#each visibleTasks as task (task.id)}
			<TaskCard
				{task}
				familyId={data.familyId}
				members={data.members}
				choreFrequency={choreFrequencyById.get(task.chore ?? -1) ?? null}
			/>
		{/each}
	{/if}
</div>
