<script lang="ts">
	import { untrack } from 'svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { createTaskAction } from '#lib/forms/tasks.remote.js';
	import { toDateString } from '#lib/utils.js';

	type Member = {
		userId: string;
		username: string | null;
	};

	let { familyId, members }: { familyId: string; members: Member[] } = $props();

	const today = toDateString(new Date());

	let isChore = $state(false);

	createTaskAction.fields.dueDate.set(untrack(() => today));
	createTaskAction.fields.frequency.set('monthly');
</script>

<form {...createTaskAction} class="mx-auto w-full max-w-md space-y-6">
	<input {...createTaskAction.fields.familyPlanId.as('hidden', familyId)} />
	<Field.Group>
		<Field.Field>
			<Field.Label for="task-title">Title</Field.Label>
			<Input
				id="task-title"
				{...createTaskAction.fields.title.as('text')}
				placeholder="Task title"
			/>
			{#each createTaskAction.fields.title.issues() ?? [] as issue (issue.message)}
				<Field.Error class="issue">{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<Field.Field>
			<Field.Label for="task-description">Description</Field.Label>
			<textarea
				id="task-description"
				{...createTaskAction.fields.description.as('text')}
				placeholder="Add details (optional)"
				class="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
			></textarea>
		</Field.Field>

		<Field.Field>
			<Field.Label for="task-due-date">Due date</Field.Label>
			<Input
				id="task-due-date"
				{...createTaskAction.fields.dueDate.as('text')}
				type="date"
				required={isChore}
				min={isChore ? today : undefined}
			/>
			{#each createTaskAction.fields.dueDate.issues() ?? [] as issue (issue.message)}
				<Field.Error class="issue">{issue.message}</Field.Error>
			{/each}
		</Field.Field>

		<Field.Field>
			<Field.Label for="task-assignee">Assignee</Field.Label>
			<select
				id="task-assignee"
				{...createTaskAction.fields.assignedTo.as('text')}
				class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
			>
				<option value="">Unassigned</option>
				{#each members as member (member.userId)}
					<option value={member.userId}>{member.username ?? 'Unnamed member'}</option>
				{/each}
			</select>
		</Field.Field>

		<Field.Field orientation="horizontal" class="items-center">
			<input
				id="task-is-chore"
				type="checkbox"
				bind:checked={isChore}
				class="size-4 accent-primary"
			/>
			<input {...createTaskAction.fields.isChore.as('hidden', isChore)} />
			<Field.Label for="task-is-chore">Recurring chore</Field.Label>
		</Field.Field>

		{#if isChore}
			<Field.Field>
				<Field.Label for="task-frequency">Frequency</Field.Label>
				<select
					id="task-frequency"
					{...createTaskAction.fields.frequency.as('text')}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
				>
					<option value="weekly">Weekly</option>
					<option value="monthly">Monthly</option>
					<option value="quarterly">Quarterly</option>
					<option value="half_yearly">Half-yearly</option>
					<option value="yearly">Yearly</option>
				</select>
				{#each createTaskAction.fields.frequency.issues() ?? [] as issue (issue.message)}
					<Field.Error class="issue">{issue.message}</Field.Error>
				{/each}
			</Field.Field>
		{/if}
	</Field.Group>

	<Button type="submit">{isChore ? 'Create chore' : 'Create task'}</Button>
</form>
